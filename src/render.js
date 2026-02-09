// ============================================
// render.js - UI Rendering Functions
// ============================================

// ============================================
// HOME VIEW RENDER
// ============================================

function renderHome(skipAnimation) {
    // Update date display
    var dateEl = document.getElementById('greeting-date');
    if (dateEl) {
        var now = new Date();
        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        dateEl.textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
    }

    // Update edit button state
    var editBtn = document.querySelector('.home-edit-btn');
    if (editBtn) {
        if (homeEditMode) {
            editBtn.classList.add('active');
        } else {
            editBtn.classList.remove('active');
        }
    }

    // Apply home layout customization if container exists
    try {
        var sectionsContainer = document.getElementById('home-sections-container');
        if (sectionsContainer && appData.settings && appData.settings.homeLayout) {
            var layout = appData.settings.homeLayout;
            
            // Reorder sections based on homeLayout
            layout.forEach(function(section) {
                var wrapper = sectionsContainer.querySelector('[data-section-id="' + section.id + '"]');
                if (wrapper) {
                    sectionsContainer.appendChild(wrapper);
                }
            });

            // Apply visibility and edit mode to each section
            layout.forEach(function(section, index) {
                var wrapper = sectionsContainer.querySelector('[data-section-id="' + section.id + '"]');
                if (!wrapper) return;

                // Set visibility
                if (section.visible) {
                    wrapper.style.display = '';
                    wrapper.classList.remove('hidden');
                } else {
                    if (homeEditMode) {
                        wrapper.style.display = '';
                        wrapper.classList.add('hidden');
                    } else {
                        wrapper.style.display = 'none';
                    }
                }

                // Set edit mode
                if (homeEditMode) {
                    wrapper.classList.add('editing');
                    
                    // Remove existing controls
                    var existingControls = wrapper.querySelector('.home-section-controls');
                    if (existingControls) {
                        existingControls.remove();
                    }

                    // Add controls
                    var controlsHtml = '<div class="home-section-controls">' +
                        '<span class="home-section-label-text">' + section.label + '</span>' +
                        '<button class="home-section-control-btn' + (index === 0 ? ' disabled' : '') + '" onclick="moveHomeSectionUp(\'' + section.id + '\')">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>' +
                        '</button>' +
                        '<button class="home-section-control-btn' + (index === layout.length - 1 ? ' disabled' : '') + '" onclick="moveHomeSectionDown(\'' + section.id + '\')">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' +
                        '</button>' +
                        '<button class="home-section-control-btn" onclick="toggleHomeSection(\'' + section.id + '\')">' +
                        (section.visible ? 'hide' : 'show') +
                        '</button>' +
                        '</div>';
                    wrapper.insertAdjacentHTML('afterbegin', controlsHtml);
                } else {
                    wrapper.classList.remove('editing', 'hidden');
                    var existingControls = wrapper.querySelector('.home-section-controls');
                    if (existingControls) {
                        existingControls.remove();
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error applying home layout:', e);
    }

    // Render dashboard stats
    renderDashboardStats(skipAnimation);

    // Render upcoming tasks
    renderDashboardUpcoming(skipAnimation);

    // Render workspaces
    var html = '';
    appData.rooms.forEach(function(room, i) {
        var roomColor = room.color;
        var roomTheme = roomColor ? (colorThemes[roomColor] || colorThemes.purple) : null;
        var roomStyle = roomTheme ? 'border-color:' + roomTheme.border + ';background:' + roomTheme.bg + ';' : '';
        var animClass = skipAnimation ? '' : ' animate-in delay-' + (i + 1);
        var roomClass = 'room-card' + animClass + (roomTheme ? ' room-colored' : '');
        var nameStyle = roomTheme ? ' style="color:' + roomTheme.text + '"' : '';
        var countStyle = roomTheme ? ' style="color:' + roomTheme.textMuted + '"' : '';
        var arrowColor = roomTheme ? roomTheme.textMuted : 'currentColor';
        var moreColor = roomTheme ? ' style="color:' + roomTheme.textMuted + '"' : '';
        html += '<div class="' + roomClass + '" data-room-id="' + room.id + '" style="' + roomStyle + '">' +
            '<div class="room-card-main" onclick="selectRoom(\'' + room.id + '\')">' +
            '<div class="info"><h2' + nameStyle + '>' + room.name + '</h2><p' + countStyle + '>' + room.cubbies.length + ' cubbies</p></div>' +
            '<span class="arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + arrowColor + '" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg></span></div>' +
            '<div class="room-more-btn"' + moreColor + ' onclick="openRoomMenu(event, \'' + room.id + '\')">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>';
    });
    // Add new room button
    var addAnimClass = skipAnimation ? '' : ' animate-in delay-' + (appData.rooms.length + 1);
    html += '<div class="add-room-btn' + addAnimClass + '" onclick="openNewRoomModal()"><span class="plus">+</span><span class="text">new workspace</span></div>';
    var roomsContainer = document.getElementById('rooms-container');
    if (roomsContainer) {
        roomsContainer.innerHTML = html;
    }
}

// ============================================
// CUBBIES BROWSE SCREEN
// ============================================

function renderCubbiesBrowse() {
    var container = document.getElementById('cubbies-browse-container');
    if (!container) return;

    var html = '';

    if (appData.rooms.length === 0) {
        html += '<div class="cubbies-browse-empty">no workspaces yet — create one from the home screen!</div>';
        container.innerHTML = html;
        return;
    }

    appData.rooms.forEach(function(room, r) {
        var roomColor = room.color;
        var roomTheme = roomColor ? (colorThemes[roomColor] || colorThemes.purple) : null;
        var animClass = ' animate-in delay-' + (r + 1);
        var headerStyle = roomTheme ? ' style="color:' + roomTheme.text + '"' : '';
        var countStyle = roomTheme ? ' style="color:' + roomTheme.textMuted + '"' : '';
        var sectionBg = roomTheme ? 'background:' + roomTheme.bg + '; border-color:' + roomTheme.border + ';' : '';

        html += '<div class="cubbies-browse-section' + animClass + '" style="' + sectionBg + '">';
        html += '<div class="cubbies-browse-section-header" onclick="selectRoom(\'' + room.id + '\')">';
        html += '<div class="cubbies-browse-section-info">';
        html += '<h2' + headerStyle + '>' + room.name + '</h2>';
        html += '<span class="cubbies-browse-count"' + countStyle + '>' + room.cubbies.length + ' cubbies</span>';
        html += '</div>';
        html += '<span class="cubbies-browse-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + (roomTheme ? roomTheme.textMuted : 'rgba(255,255,255,0.3)') + '" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg></span>';
        html += '</div>';

        // List cubbies in this workspace
        if (room.cubbies.length > 0) {
            html += '<div class="cubbies-browse-list">';
            room.cubbies.forEach(function(cubby) {
                var theme = colorThemes[cubby.color] || colorThemes.purple;
                var taskCount = 0;
                var cubbyData = appData.cubbies[cubby.id];
                if (cubbyData) {
                    cubbyData.subcubbies.forEach(function(sub) {
                        taskCount += sub.tasks.filter(function(t) { return !t.completed; }).length;
                    });
                }
                html += '<div class="cubbies-browse-item" onclick="event.stopPropagation(); browseSelectCubby(\'' + room.id + '\', \'' + cubby.id + '\')">';
                html += '<div class="cubbies-browse-dot" style="background:' + theme.primary + '"></div>';
                html += '<span class="cubbies-browse-name" style="color:' + theme.text + '">' + cubby.name + '</span>';
                html += '<span class="cubbies-browse-task-count" style="color:' + theme.textMuted + '">' + taskCount + ' tasks</span>';
                html += '<svg class="cubbies-browse-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + theme.textMuted + '" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg>';
                html += '</div>';
            });
            html += '</div>';
        }

        html += '</div>';
    });

    // Add new workspace button
    html += '<div class="cubbies-browse-add animate-in delay-' + (appData.rooms.length + 1) + '" onclick="openNewRoomModal()">';
    html += '<span class="plus">+</span><span class="text">new workspace</span>';
    html += '</div>';

    container.innerHTML = html;
}

// Helper to navigate to a cubby from the browse screen
function browseSelectCubby(roomId, cubbyId) {
    currentRoom = appData.rooms.find(function(r) { return r.id === roomId; });
    if (!currentRoom) return;
    selectCubby(cubbyId);
}

// ============================================
// DASHBOARD STATS
// ============================================

function renderDashboardStats(skipAnimation) {
    var container = document.getElementById('dashboard-stats');
    if (!container) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var overdueCount = 0;
    var todayCount = 0;
    var thisWeekCount = 0;
    var completedThisWeek = 0;

    // Calculate start of this week (Monday)
    var weekStart = new Date(today);
    var dayOfWeek = weekStart.getDay();
    var diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(weekStart.getDate() - diff);

    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;
            cubbyData.subcubbies.forEach(function(sub) {
                sub.tasks.forEach(function(task) {
                    if (task.completed) {
                        // Check if completed this week
                        if (task.completedAt) {
                            var completedDate = new Date(task.completedAt);
                            if (completedDate >= weekStart) completedThisWeek++;
                        }
                        return;
                    }
                    if (!task.dueDate) return;
                    var dueDate = new Date(task.dueDate + 'T00:00:00');
                    var diffTime = dueDate - today;
                    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 0) overdueCount++;
                    else if (diffDays === 0) todayCount++;
                    else if (diffDays <= 7) thisWeekCount++;
                });
            });
        });
    });

    var stats = [
        { label: 'overdue', count: overdueCount, color: '#ff6b6b', bgColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.25)', filter: 'overdue' },
        { label: 'today', count: todayCount, color: '#feca57', bgColor: 'rgba(254, 202, 87, 0.1)', borderColor: 'rgba(254, 202, 87, 0.25)', filter: 'today' },
        { label: 'this week', count: thisWeekCount, color: '#5B8EFF', bgColor: 'rgba(91, 142, 255, 0.1)', borderColor: 'rgba(91, 142, 255, 0.25)', filter: 'this-week' },
        { label: 'done', count: completedThisWeek, color: '#6bf5a0', bgColor: 'rgba(107, 245, 160, 0.1)', borderColor: 'rgba(107, 245, 160, 0.25)', filter: null }
    ];

    var html = '';
    stats.forEach(function(stat) {
        var onclick = stat.filter ? ' onclick="openViews(); setTimeout(function(){ setViewFilter(\'' + stat.filter + '\'); }, 50);"' : '';
        var cursorStyle = stat.filter ? ' cursor: pointer;' : '';
        html += '<div class="dashboard-stat-card"' + onclick + ' style="background:' + stat.bgColor + '; border-color:' + stat.borderColor + ';' + cursorStyle + '">' +
            '<span class="stat-count" style="color:' + stat.color + '">' + stat.count + '</span>' +
            '<span class="stat-label" style="color:' + stat.color + '">' + stat.label + '</span>' +
            '</div>';
    });

    container.innerHTML = html;
}

// ============================================
// DASHBOARD UPCOMING TASKS
// ============================================

function renderDashboardUpcoming(skipAnimation) {
    var container = document.getElementById('dashboard-upcoming');
    if (!container) return;

    // Collect all incomplete tasks with due dates
    var tasks = [];
    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;
            cubbyData.subcubbies.forEach(function(sub) {
                sub.tasks.forEach(function(task) {
                    if (task.completed) return;
                    tasks.push({
                        task: task,
                        roomId: room.id,
                        cubbyId: cubbyRef.id,
                        cubbyName: cubbyRef.name,
                        cubbyColor: cubbyRef.color,
                        subcubbyId: sub.id
                    });
                });
            });
        });
    });

    // Sort: tasks with due dates first (by date), then no-date tasks
    tasks.sort(function(a, b) {
        var aDate = a.task.dueDate;
        var bDate = b.task.dueDate;
        if (aDate && !bDate) return -1;
        if (!aDate && bDate) return 1;
        if (aDate && bDate) return aDate.localeCompare(bDate);
        return 0;
    });

    // Take first 7
    var upcoming = tasks.slice(0, 7);

    if (upcoming.length === 0) {
        container.innerHTML = '<div class="dashboard-upcoming-header"><span class="upcoming-title">upcoming</span></div>' +
            '<div class="upcoming-empty">no tasks yet — create one to get started!</div>';
        return;
    }

    var html = '<div class="dashboard-upcoming-header">' +
        '<span class="upcoming-title">upcoming</span>' +
        '<button class="upcoming-see-all" onclick="openViews()">see all</button>' +
        '</div>';

    upcoming.forEach(function(item) {
        var task = item.task;
        var dueDateInfo = formatDueDate(task.dueDate);
        var classification = classifyDueDate(task);
        var dateTheme = dueDateColorThemes[classification] || dueDateColorThemes['no-date'];
        var cubbyTheme = colorThemes[item.cubbyColor] || colorThemes.purple;

        html += '<div class="upcoming-task" style="background:' + cubbyTheme.card + '; border-color:' + cubbyTheme.border + ';" onclick="navigateToTask(\'' + item.roomId + '\', \'' + item.cubbyId + '\', \'' + item.subcubbyId + '\', \'' + task.id + '\')">';
        // Cubby color dot
        html += '<div class="upcoming-cubby-dot" style="background:' + cubbyTheme.primary + '" title="' + item.cubbyName + '"></div>';
        // Task text + cubby name
        html += '<div class="upcoming-task-info">';
        html += '<span class="upcoming-task-text" style="text-transform: none; color:' + cubbyTheme.text + '">' + task.text + '</span>';
        html += '<span class="upcoming-cubby-name" style="color:' + cubbyTheme.textMuted + '">' + item.cubbyName + '</span>';
        html += '</div>';
        // Due date pill
        if (dueDateInfo.text) {
            html += '<span class="upcoming-due-pill" style="color:' + dateTheme.primary + '; background:' + dateTheme.card + '; border-color:' + dateTheme.border + '">' + dueDateInfo.text + '</span>';
        } else {
            html += '<span class="upcoming-due-pill upcoming-no-date">no date</span>';
        }
        html += '</div>';
    });

    container.innerHTML = html;
}

// ============================================
// ROOM VIEW RENDER
// ============================================

function renderRoom(room) {
    document.getElementById('room-title').innerHTML = '<h1>' + room.name + '</h1>';
    var html = '';
    room.cubbies.forEach(function(cubby, i) {
        var theme = colorThemes[cubby.color] || colorThemes.purple;
        html += '<div class="cubby-card animate-in delay-' + (i + 1) + '" data-cubby-id="' + cubby.id + '" style="background:' + theme.card + ';border:2px solid ' + theme.border + ';">' +
            '<div class="cubby-card-main" onclick="selectCubby(\'' + cubby.id + '\')">' +
            '<span class="name" style="color:' + theme.text + '">' + cubby.name + '</span>' +
            '<span class="arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + theme.textMuted + '" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg></span></div>' +
            '<div class="cubby-more-btn" onclick="openCubbyMenu(event, \'' + cubby.id + '\')" style="color:' + theme.textMuted + '">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>';
    });
    // Add new cubby button
    html += '<div class="add-cubby-btn animate-in delay-' + (room.cubbies.length + 1) + '" onclick="openNewCubbyModal()"><span class="plus">+</span><span class="text">new cubby</span></div>';
    document.getElementById('cubbies-list').innerHTML = html;
}

// ============================================
// CUBBY VIEW RENDER
// ============================================

function renderCubby(cubby) {
    if (cubbyDateColorMode) {
        // Keep greyscale theme when date color mode is active
        var root = document.getElementById('cubby-screen');
        root.style.background = '#0a0a0f';
        root.style.setProperty('--cubby-primary', 'rgba(255,255,255,0.5)');
        root.style.setProperty('--cubby-card', 'rgba(255,255,255,0.05)');
        root.style.setProperty('--cubby-card-hover', 'rgba(255,255,255,0.08)');
        root.style.setProperty('--cubby-border', 'rgba(255,255,255,0.12)');
        root.style.setProperty('--cubby-text', '#ffffff');
        root.style.setProperty('--cubby-text-muted', 'rgba(255,255,255,0.5)');
        root.style.setProperty('--cubby-glow', 'rgba(255,255,255,0.1)');
    } else {
        setCubbyTheme(cubby.color || 'purple');
    }
    var titleHtml = '<h1>' + cubby.name + '</h1>';
    if (cubby.description) {
        titleHtml += '<p class="cubby-description">' + cubby.description.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
    }
    document.getElementById('cubby-title').innerHTML = titleHtml;
    var cubbyData = appData.cubbies[cubby.id];
    
    // Initialize cubby data if it doesn't exist
    if (!cubbyData) {
        appData.cubbies[cubby.id] = {
            subcubbies: [{
                id: generateUUID(),
                name: 'General',
                expanded: true,
                tasks: []
            }]
        };
        cubbyData = appData.cubbies[cubby.id];
        saveData();
    }
    
    // Collapse all tasks when entering cubby
    var needsSave = false;
    cubbyData.subcubbies.forEach(function(sub) {
        sub.tasks.forEach(function(task) {
            if (task.expanded) {
                task.expanded = false;
                needsSave = true;
            }
        });
    });
    if (needsSave) saveData();
    
    var html = '';
    cubbyData.subcubbies.forEach(function(sub, s) {
        var taskCount = sub.tasks.filter(function(t) { return !t.completed; }).length;
        html += '<div class="subcubby animate-in delay-' + (s + 1) + '" data-subcubby-id="' + sub.id + '">' +
            '<div class="subcubby-header ' + (sub.expanded ? 'expanded' : 'collapsed') + '">' +
            '<div class="subcubby-header-left" onclick="toggleSubcubby(\'' + sub.id + '\')">' +
            '<svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6L15 12L9 18"/></svg>' +
            '<h3>' + sub.name + '</h3><span class="count">' + taskCount + ' tasks</span></div>' +
            '<div class="subcubby-more-btn" onclick="openSubcubbyMenu(event, \'' + sub.id + '\')">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>' +
            '<div class="subcubby-tasks ' + (sub.expanded ? 'visible' : '') + '" data-subcubby-tasks="' + sub.id + '"><div class="subcubby-tasks-inner">';
        sub.tasks.forEach(function(task) { html += renderTask(task); });
        html += '<div class="add-task-btn" onclick="openModal(\'' + sub.id + '\')"><span class="plus">+</span><span class="text">new task</span></div></div></div></div>';
    });
    // Add new subcubby button
    html += '<div class="add-subcubby-btn" onclick="openNewSubcubbyModal()"><span class="plus">+</span><span class="text">new subcubby</span></div>';
    
    var tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = html;
    
    // No expanded tasks on entry, so no focus mode
    tasksContainer.classList.remove('has-expanded-task');
}

// ============================================
// TASK RENDER
// ============================================

function renderTask(task) {
    var hasSubtasks = task.subtasks && task.subtasks.length > 0;
    var theme = colorThemes[currentCubby.color];

    // When cubbyDateColorMode is active, pick theme by due date category
    var taskTheme = theme;
    var inlineVars = '';
    if (cubbyDateColorMode && !task.completed) {
        var dateGroup = classifyDueDate(task);
        taskTheme = dueDateColorThemes[dateGroup] || dueDateColorThemes['no-date'];
        inlineVars = '--cubby-primary:' + taskTheme.primary +
            ';--cubby-card:' + taskTheme.card +
            ';--cubby-card-hover:' + taskTheme.cardHover +
            ';--cubby-border:' + taskTheme.border +
            ';--cubby-text:' + taskTheme.text +
            ';--cubby-text-muted:' + taskTheme.textMuted +
            ';--cubby-glow:' + taskTheme.glow;
    }

    var isOverdue = false;
    if (task.dueDate && !task.completed) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var due = new Date(task.dueDate + 'T00:00:00');
        isOverdue = due < today;
    }
    var html = '<div class="task ' + (task.expanded ? 'expanded' : '') + (task.completed ? ' completed-task' : '') + (hasSubtasks ? ' has-subtasks' : '') + (isOverdue ? ' task-overdue' : '') + '" data-task-id="' + task.id + '"' + (inlineVars ? ' style="' + inlineVars + '"' : '') + '>' +
        '<div class="checkbox ' + (task.completed ? 'checked' : '') + '" onclick="toggleTask(\'' + task.id + '\')">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="' + taskTheme.bg + '" stroke-width="2.5" stroke-linecap="round"/></svg></div>' +
        '<span class="task-text ' + (task.completed ? 'completed' : '') + '">' + task.text + '</span>';

    // Tags
    var hasTags = task.tags && task.tags.length > 0;
    if (hasTags) {
        html += '<div class="task-tags">';
        task.tags.forEach(function(tag) {
            html += '<span class="task-tag tag-' + tag.color + '">' + tag.text + '</span>';
        });
        html += '</div>';
    }

    // Memo indicator icon
    var hasMemo = task.memo && task.memo.trim();
    if (hasMemo) {
        html += '<div class="memo-indicator"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>';
    }

    // Right-side indicators wrapper (progress, counter, due date)
    html += '<div class="task-indicators">';

    // Subtask progress bar + counter
    if (hasSubtasks) {
        var completedCount = task.subtasks.filter(function(st) { return st.completed; }).length;
        var totalCount = task.subtasks.length;
        var allComplete = completedCount === totalCount;
        var pct = Math.round((completedCount / totalCount) * 100);
        html += '<div class="task-progress"><div class="task-progress-fill' + (allComplete ? ' complete' : '') + '" style="width:' + pct + '%"></div></div>';
        html += '<div class="subtask-counter' + (allComplete ? ' all-complete' : '') + '" onclick="toggleTaskExpand(\'' + task.id + '\')">' +
            '<span class="subtask-count">' + completedCount + '/' + totalCount + '</span>' +
            '</div>';
    }

    // Due date (always shown — blank box if no date)
    var dueDateInfo = formatDueDate(task.dueDate);
    if (dueDateInfo.text) {
        html += '<span class="task-due-date ' + dueDateInfo.class + '">' + dueDateInfo.text + '</span>';
    } else {
        html += '<span class="task-due-date no-date"></span>';
    }

    html += '</div>';

    // Expand and kebab buttons
    html += '<div class="expand-btn ' + (task.expanded ? 'expanded' : '') + '" onclick="toggleTaskExpand(\'' + task.id + '\')">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg></div>';
    html += '<div class="more-btn" onclick="openTaskMenu(event, \'' + task.id + '\', false)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div>';
    html += '</div>';
    
    // Subtasks container (always rendered, visibility controlled by expanded state)
    html += '<div class="subtasks-container ' + (task.expanded ? 'visible' : '') + '" data-parent-task="' + task.id + '">';
    // Memo display (above subtasks)
    if (hasMemo) {
        html += '<div class="task-memo-display">' + task.memo.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') + '</div>';
    }
    if (hasSubtasks) {
        task.subtasks.forEach(function(st) {
            html += renderSubtask(st, task.id, theme);
        });
    }
    // Add subtask button
    html += '<div class="add-subtask-btn" onclick="openSubtaskModal(\'' + task.id + '\')"><span class="plus">+</span><span class="text">add subtask</span></div>';
    html += '</div>';
    return html;
}

// ============================================
// SUBTASK RENDER
// ============================================

function renderSubtask(st, parentTaskId, theme) {
    var stHasTags = st.tags && st.tags.length > 0;
    var stIsOverdue = false;
    if (st.dueDate && !st.completed) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var due = new Date(st.dueDate + 'T00:00:00');
        stIsOverdue = due < today;
    }

    // When cubbyDateColorMode is active, pick theme by due date category
    var stTheme = theme;
    var stInlineVars = '';
    if (cubbyDateColorMode && !st.completed) {
        var dateGroup = classifyDueDate(st);
        stTheme = dueDateColorThemes[dateGroup] || dueDateColorThemes['no-date'];
        stInlineVars = '--cubby-primary:' + stTheme.primary +
            ';--cubby-card:' + stTheme.card +
            ';--cubby-card-hover:' + stTheme.cardHover +
            ';--cubby-border:' + stTheme.border +
            ';--cubby-text:' + stTheme.text +
            ';--cubby-text-muted:' + stTheme.textMuted +
            ';--cubby-glow:' + stTheme.glow;
    }

    // Build subtask elements in order: Tags → Due Date → Kebab
    var tagsHtml = '';
    if (stHasTags) {
        tagsHtml += '<div class="task-tags">';
        st.tags.forEach(function(tag) {
            tagsHtml += '<span class="task-tag tag-' + tag.color + '">' + tag.text + '</span>';
        });
        tagsHtml += '</div>';
    }

    var stDueDateInfo = formatDueDate(st.dueDate);
    var dueDateHtml = '';
    if (stDueDateInfo.text) {
        dueDateHtml = '<span class="task-due-date ' + stDueDateInfo.class + '">' + stDueDateInfo.text + '</span>';
    } else {
        dueDateHtml = '<span class="task-due-date no-date"></span>';
    }

    return '<div class="task subtask ' + (st.completed ? 'completed-task' : '') + (stIsOverdue ? ' task-overdue' : '') + '" data-task-id="' + st.id + '" data-parent="' + parentTaskId + '"' + (stInlineVars ? ' style="' + stInlineVars + '"' : '') + '>' +
        '<div class="checkbox small ' + (st.completed ? 'checked' : '') + '" onclick="toggleSubtask(\'' + parentTaskId + '\',\'' + st.id + '\')">' +
        '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="' + stTheme.bg + '" stroke-width="2.5" stroke-linecap="round"/></svg></div>' +
        '<span class="task-text ' + (st.completed ? 'completed' : '') + '">' + st.text + '</span>' +
        tagsHtml + dueDateHtml +
        '<div class="more-btn" onclick="openTaskMenu(event, \'' + st.id + '\', true, \'' + parentTaskId + '\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>';
}
