// ============================================
// search.js - Global Search Functionality
// ============================================

var searchOpen = false;

// ============================================
// SEARCH ALL TASKS
// ============================================

function searchTasks(query, filters) {
    var results = [];
    var queryLower = query.toLowerCase().trim();
    
    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;
            
            cubbyData.subcubbies.forEach(function(subcubby) {
                subcubby.tasks.forEach(function(task) {
                    // Check if task matches
                    var match = matchesSearch(task, queryLower, filters);
                    if (match) {
                        results.push({
                            type: 'task',
                            task: task,
                            roomId: room.id,
                            roomName: room.name,
                            cubbyId: cubbyRef.id,
                            cubbyName: cubbyRef.name,
                            cubbyColor: cubbyRef.color,
                            subcubbyId: subcubby.id,
                            subcubbyName: subcubby.name
                        });
                    }
                    
                    // Also search subtasks
                    if (task.subtasks) {
                        task.subtasks.forEach(function(subtask) {
                            var subMatch = matchesSearch(subtask, queryLower, filters);
                            if (subMatch) {
                                results.push({
                                    type: 'subtask',
                                    task: subtask,
                                    parentTask: task,
                                    roomId: room.id,
                                    roomName: room.name,
                                    cubbyId: cubbyRef.id,
                                    cubbyName: cubbyRef.name,
                                    cubbyColor: cubbyRef.color,
                                    subcubbyId: subcubby.id,
                                    subcubbyName: subcubby.name
                                });
                            }
                        });
                    }
                });
            });
        });
    });
    
    return results;
}

function matchesSearch(task, queryLower, filters) {
    // Text match
    var textMatch = !queryLower || task.text.toLowerCase().includes(queryLower);
    
    // Tag filter
    var tagMatch = true;
    if (filters && filters.tag) {
        tagMatch = task.tags && task.tags.some(function(t) {
            return t.text.toLowerCase().includes(filters.tag.toLowerCase()) ||
                   t.color === filters.tag;
        });
    }
    
    // Due date filter
    var dueMatch = true;
    if (filters && filters.due) {
        if (!task.dueDate) {
            dueMatch = filters.due === 'none';
        } else {
            var dueDateInfo = formatDueDate(task.dueDate);
            if (filters.due === 'overdue') {
                dueMatch = dueDateInfo.class === 'overdue';
            } else if (filters.due === 'today') {
                dueMatch = dueDateInfo.class === 'due-today';
            } else if (filters.due === 'soon') {
                dueMatch = dueDateInfo.class === 'due-soon' || dueDateInfo.class === 'due-today';
            } else if (filters.due === 'any') {
                dueMatch = true;
            }
        }
    }
    
    // Completed filter
    var completedMatch = true;
    if (filters && filters.completed !== undefined) {
        completedMatch = task.completed === filters.completed;
    }
    
    return textMatch && tagMatch && dueMatch && completedMatch;
}

// ============================================
// OPEN SEARCH MODAL
// ============================================

function openSearchModal() {
    searchOpen = true;

    // Remove active highlight from all data-tab nav tabs
    var tabs = document.querySelectorAll('.nav-tab[data-tab]');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });

    // Highlight search nav tab
    var searchTab = document.querySelector('.nav-tab-search');
    if (searchTab) searchTab.classList.add('active');

    // Remove existing modal if any
    var existing = document.getElementById('search-modal');
    if (existing) existing.remove();
    
    var modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'modal active';
    modal.innerHTML = 
        '<div class="modal-backdrop" onclick="closeSearchModal()"></div>' +
        '<div class="search-modal-content">' +
            '<div class="search-header">' +
                '<div class="search-input-wrapper">' +
                    '<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
                    '<input type="text" id="search-input" placeholder="Search tasks..." autocomplete="off">' +
                    '<button class="search-clear-btn" onclick="clearSearchInput()" style="display:none;">×</button>' +
                '</div>' +
            '</div>' +
            '<div class="search-filters">' +
                '<button class="filter-btn" data-filter="all" onclick="setSearchFilter(\'all\')">All</button>' +
                '<button class="filter-btn" data-filter="active" onclick="setSearchFilter(\'active\')">Active</button>' +
                '<button class="filter-btn" data-filter="completed" onclick="setSearchFilter(\'completed\')">Completed</button>' +
                '<button class="filter-btn" data-filter="due-soon" onclick="setSearchFilter(\'due-soon\')">Due Soon</button>' +
                '<button class="filter-btn" data-filter="overdue" onclick="setSearchFilter(\'overdue\')">Overdue</button>' +
            '</div>' +
            '<div class="search-results" id="search-results">' +
                '<div class="search-empty">Start typing to search across all your tasks...</div>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
    
    // Focus input
    var input = document.getElementById('search-input');
    setTimeout(function() { input.focus(); }, 100);
    
    // Set default filter
    setSearchFilter('all');
    
    // Add input listener
    input.addEventListener('input', function() {
        var clearBtn = modal.querySelector('.search-clear-btn');
        clearBtn.style.display = this.value ? 'block' : 'none';
        performSearch();
    });
    
    // Handle keyboard
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearchModal();
        }
    });
}

// ============================================
// SEARCH FILTERS
// ============================================

var currentSearchFilter = 'all';

function setSearchFilter(filter) {
    currentSearchFilter = filter;
    
    // Update button states
    document.querySelectorAll('.search-filters .filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    performSearch();
}

function clearSearchInput() {
    var input = document.getElementById('search-input');
    input.value = '';
    input.focus();
    document.querySelector('.search-clear-btn').style.display = 'none';
    performSearch();
}

// ============================================
// PERFORM SEARCH
// ============================================

function performSearch() {
    var input = document.getElementById('search-input');
    var query = input.value;
    var resultsContainer = document.getElementById('search-results');
    
    // Build filters based on current filter selection
    var filters = {};
    
    switch (currentSearchFilter) {
        case 'active':
            filters.completed = false;
            break;
        case 'completed':
            filters.completed = true;
            break;
        case 'overdue':
            filters.due = 'overdue';
            filters.completed = false;
            break;
        case 'due-soon':
            filters.due = 'soon';
            filters.completed = false;
            break;
    }
    
    // If no query and filter is 'all', show empty state
    if (!query && currentSearchFilter === 'all') {
        resultsContainer.innerHTML = '<div class="search-empty">Start typing to search across all your tasks...</div>';
        return;
    }
    
    var results = searchTasks(query, filters);
    
    if (results.length === 0) {
        var emptyMsg = query ? 'No tasks found matching "' + query + '"' : 'No tasks match this filter';
        resultsContainer.innerHTML = '<div class="search-empty">' + emptyMsg + '</div>';
        return;
    }
    
    // Group results by cubby
    var grouped = {};
    results.forEach(function(r) {
        var key = r.roomName + ' → ' + r.cubbyName;
        if (!grouped[key]) {
            grouped[key] = {
                roomId: r.roomId,
                cubbyId: r.cubbyId,
                cubbyColor: r.cubbyColor,
                items: []
            };
        }
        grouped[key].items.push(r);
    });
    
    // Render results
    var html = '';
    Object.keys(grouped).forEach(function(groupName) {
        var group = grouped[groupName];
        var theme = colorThemes[group.cubbyColor] || colorThemes.purple;
        
        html += '<div class="search-group">' +
            '<div class="search-group-header" style="color:' + theme.primary + '">' +
                '<span class="search-group-path">' + groupName + '</span>' +
                '<span class="search-group-count">' + group.items.length + '</span>' +
            '</div>';
        
        group.items.forEach(function(item) {
            var task = item.task;
            var isSubtask = item.type === 'subtask';
            
            // Build task HTML
            html += '<div class="search-result-item' + (task.completed ? ' completed' : '') + '" ' +
                'onclick="navigateToTask(\'' + item.roomId + '\', \'' + item.cubbyId + '\', \'' + item.subcubbyId + '\', \'' + task.id + '\')">';
            
            // Checkbox indicator
            html += '<div class="search-result-check' + (task.completed ? ' checked' : '') + '" style="border-color:' + theme.primary + ';' + (task.completed ? 'background:' + theme.primary : '') + '">' +
                (task.completed ? '<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="' + theme.bg + '" stroke-width="2.5" stroke-linecap="round"/></svg>' : '') +
                '</div>';
            
            // Task text
            html += '<div class="search-result-content">';
            if (isSubtask) {
                html += '<span class="search-result-subtask-indicator">↳</span>';
            }
            html += '<span class="search-result-text">' + highlightMatch(task.text, query) + '</span>';
            
            // Meta info (tags, due date)
            var metaHtml = '';
            if (task.tags && task.tags.length > 0) {
                task.tags.forEach(function(tag) {
                    metaHtml += '<span class="search-result-tag" style="background:' + tagColors[tag.color].bg + ';color:' + tagColors[tag.color].text + '">' + tag.text + '</span>';
                });
            }
            if (task.dueDate) {
                var dueDateInfo = formatDueDate(task.dueDate);
                metaHtml += '<span class="search-result-due ' + dueDateInfo.class + '">' + dueDateInfo.text + '</span>';
            }
            if (metaHtml) {
                html += '<div class="search-result-meta">' + metaHtml + '</div>';
            }
            
            html += '</div>'; // end content
            
            // Location breadcrumb
            html += '<span class="search-result-location">' + item.subcubbyName + '</span>';
            
            html += '</div>'; // end item
        });
        
        html += '</div>'; // end group
    });
    
    resultsContainer.innerHTML = html;
}

function highlightMatch(text, query) {
    if (!query) return text;
    var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// ============================================
// NAVIGATE TO TASK
// ============================================

function navigateToTask(roomId, cubbyId, subcubbyId, taskId) {
    closeSearchModal();
    
    // Navigate to the room
    var room = appData.rooms.find(function(r) { return r.id === roomId; });
    if (!room) return;
    
    currentRoom = room;
    
    // Navigate to the cubby
    var cubby = room.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!cubby) return;
    
    currentCubby = cubby;
    
    // Ensure the subcubby is expanded
    var cubbyData = appData.cubbies[cubbyId];
    if (cubbyData) {
        var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
        if (subcubby) {
            subcubby.expanded = true;
        }
        
        // Also expand parent task if it's a subtask
        cubbyData.subcubbies.forEach(function(sub) {
            sub.tasks.forEach(function(task) {
                if (task.subtasks) {
                    var isSubtask = task.subtasks.some(function(st) { return st.id === taskId; });
                    if (isSubtask) {
                        task.expanded = true;
                    }
                }
            });
        });
        
        saveData();
    }
    
    // Show cubby screen
    currentView = 'cubby';
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('views-screen').classList.remove('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.add('active');
    updateNavBar();

    // Render and highlight
    renderCubby(currentCubby);

    // Scroll to and highlight the task after a brief delay
    setTimeout(function() {
        var taskEl = document.querySelector('[data-task-id="' + taskId + '"]');
        if (taskEl) {
            taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            taskEl.classList.add('search-highlight');

            // Dim other tasks to focus on highlighted one
            var tasksContainer = document.getElementById('tasks-container');
            tasksContainer.classList.add('has-highlighted-task');
            taskEl.classList.add('highlight-target');

            // Click anywhere to dismiss highlight and restore normal view
            function dismissHighlight() {
                taskEl.classList.remove('search-highlight');
                taskEl.classList.remove('highlight-target');
                tasksContainer.classList.remove('has-highlighted-task');
                document.removeEventListener('click', dismissHighlight);
            }

            // Use setTimeout so this click handler doesn't fire immediately
            setTimeout(function() {
                document.addEventListener('click', dismissHighlight);
            }, 50);
        }
    }, 100);
}

// ============================================
// CLOSE SEARCH
// ============================================

function closeSearchModal() {
    searchOpen = false;

    // Remove search nav tab highlight
    var searchTab = document.querySelector('.nav-tab-search');
    if (searchTab) searchTab.classList.remove('active');

    // Restore correct tab highlighting
    updateNavBar();

    var modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(function() { modal.remove(); }, 200);
    }
}

// ============================================
// KEYBOARD SHORTCUT
// ============================================

document.addEventListener('keydown', function(e) {
    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) {
            closeSearchModal();
        } else {
            openSearchModal();
        }
    }
});
