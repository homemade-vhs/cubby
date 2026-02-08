// ============================================
// views.js - Views (Tasks by Due Date)
// ============================================

// ============================================
// VIEW GROUP DEFINITIONS
// ============================================

var viewGroups = [
    { key: 'overdue',   label: 'Overdue',   color: '#ff6b6b' },
    { key: 'today',     label: 'Today',     color: '#ffb347' },
    { key: 'tomorrow',  label: 'Tomorrow',  color: '#feca57' },
    { key: 'this-week', label: 'This Week', color: '#5B8EFF' },
    { key: 'next-week', label: 'Next Week', color: '#5AF0E0' },
    { key: 'later',     label: 'Later',     color: 'rgba(255,255,255,0.5)' },
    { key: 'no-date',   label: 'No Date',   color: 'rgba(255,255,255,0.3)' }
];

var activeViewFilter = 'all'; // 'all' or one of the viewGroup keys

// ============================================
// CLASSIFY TASK BY DUE DATE
// ============================================

function classifyDueDate(task) {
    if (!task.dueDate) return 'no-date';

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var dueDate = new Date(task.dueDate + 'T00:00:00');
    var diffTime = dueDate - today;
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays <= 7) return 'this-week';
    if (diffDays <= 14) return 'next-week';
    return 'later';
}

// ============================================
// COLLECT ALL INCOMPLETE TASKS
// ============================================

function collectAllTasks() {
    var results = [];

    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;

            cubbyData.subcubbies.forEach(function(subcubby) {
                subcubby.tasks.forEach(function(task) {
                    if (task.completed) return;

                    results.push({
                        task: task,
                        roomId: room.id,
                        roomName: room.name,
                        cubbyId: cubbyRef.id,
                        cubbyName: cubbyRef.name,
                        cubbyColor: cubbyRef.color,
                        subcubbyId: subcubby.id,
                        subcubbyName: subcubby.name
                    });
                });
            });
        });
    });

    return results;
}

// ============================================
// RENDER VIEWS
// ============================================

function renderViews() {
    var allTasks = collectAllTasks();
    var container = document.getElementById('views-container');

    // Group tasks by due date category
    var grouped = {};
    viewGroups.forEach(function(g) { grouped[g.key] = []; });

    allTasks.forEach(function(item) {
        var group = classifyDueDate(item.task);
        grouped[group].push(item);
    });

    // Sort tasks within each group by due date (earliest first), no-date by name
    viewGroups.forEach(function(g) {
        if (g.key === 'no-date') {
            grouped[g.key].sort(function(a, b) {
                return a.task.text.localeCompare(b.task.text);
            });
        } else {
            grouped[g.key].sort(function(a, b) {
                return (a.task.dueDate || '').localeCompare(b.task.dueDate || '');
            });
        }
    });

    // Build filter buttons
    var html = '<div class="view-filters">';
    html += '<button class="view-filter-btn' + (activeViewFilter === 'all' ? ' active' : '') + '" onclick="setViewFilter(\'all\')">All</button>';
    viewGroups.forEach(function(group) {
        var count = grouped[group.key].length;
        if (count === 0) return; // Skip empty groups
        var isActive = activeViewFilter === group.key;
        html += '<button class="view-filter-btn' + (isActive ? ' active' : '') + '" style="--filter-color:' + group.color + '" onclick="setViewFilter(\'' + group.key + '\')">' + group.label + '</button>';
    });
    html += '</div>';

    // Build task groups
    var totalTasks = 0;

    viewGroups.forEach(function(group) {
        var items = grouped[group.key];
        if (items.length === 0) return;

        // Skip groups that don't match the active filter
        if (activeViewFilter !== 'all' && activeViewFilter !== group.key) return;

        totalTasks += items.length;

        html += '<div class="view-group" data-view-group="' + group.key + '">';
        html += '<div class="view-group-header" style="color:' + group.color + '" onclick="toggleViewGroup(\'' + group.key + '\')">';
        html += '<svg class="view-group-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6L15 12L9 18"/></svg>';
        html += '<span class="view-group-label">' + group.label + '</span>';
        html += '<span class="view-group-count" style="background:' + group.color + '">' + items.length + '</span>';
        html += '</div>';

        html += '<div class="view-group-items">';
        items.forEach(function(item) {
            html += renderViewTask(item, group);
        });
        html += '</div>';
        html += '</div>';
    });

    if (totalTasks === 0 && activeViewFilter === 'all') {
        html += '<div class="views-empty">No tasks to show. Add some tasks with due dates to see them here.</div>';
    } else if (totalTasks === 0) {
        html += '<div class="views-empty">No tasks in this category.</div>';
    }

    container.innerHTML = html;
}

// ============================================
// RENDER SINGLE VIEW TASK
// ============================================

function renderViewTask(item, group) {
    var task = item.task;
    var theme = colorThemes[item.cubbyColor] || colorThemes.purple;

    // Inline CSS variables so .task styles work outside #cubby-screen
    var inlineVars = '--cubby-primary:' + theme.primary +
        ';--cubby-card:' + theme.card +
        ';--cubby-card-hover:' + theme.cardHover +
        ';--cubby-border:' + theme.border +
        ';--cubby-text:' + theme.text +
        ';--cubby-text-muted:' + theme.textMuted +
        ';--cubby-glow:' + theme.glow;

    var html = '<div class="view-task-card" style="' + inlineVars + '" data-view-task-id="' + task.id + '">';

    // Task card — reuses .task class structure
    html += '<div class="task" onclick="navigateToTask(\'' + item.roomId + '\', \'' + item.cubbyId + '\', \'' + item.subcubbyId + '\', \'' + task.id + '\')">';

    // Location label (inside card, above task content)
    html += '<div class="view-task-location" style="color:' + theme.primary + '">' + item.cubbyName + '</div>';

    // Checkbox
    html += '<div class="checkbox" onclick="event.stopPropagation(); toggleViewTask(\'' + task.id + '\')">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="' + theme.bg + '" stroke-width="2.5" stroke-linecap="round"/></svg></div>';

    // Task text (clickable to navigate)
    html += '<span class="task-text">' + task.text + '</span>';

    // Task meta (tags + due date)
    var hasTags = task.tags && task.tags.length > 0;
    var hasDueDate = task.dueDate;
    if (hasTags || hasDueDate) {
        html += '<div class="task-meta">';
        if (hasTags) {
            html += '<div class="task-tags">';
            task.tags.forEach(function(tag) {
                html += '<span class="task-tag tag-' + tag.color + '">' + tag.text + '</span>';
            });
            html += '</div>';
        }
        if (hasDueDate) {
            var dueDateInfo = formatDueDate(task.dueDate);
            html += '<span class="task-due-date ' + dueDateInfo.class + '">' + dueDateInfo.text + '</span>';
        }
        html += '</div>';
    }

    // Memo indicator
    var hasMemo = task.memo && task.memo.trim();
    if (hasMemo) {
        html += '<div class="memo-indicator"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>';
    }

    // Subtask progress bar + counter
    var hasSubtasks = task.subtasks && task.subtasks.length > 0;
    if (hasSubtasks) {
        var completedCount = task.subtasks.filter(function(st) { return st.completed; }).length;
        var totalCount = task.subtasks.length;
        var allComplete = completedCount === totalCount;
        var pct = Math.round((completedCount / totalCount) * 100);
        html += '<div class="task-progress"><div class="task-progress-fill' + (allComplete ? ' complete' : '') + '" style="width:' + pct + '%"></div></div>';
        html += '<div class="subtask-counter' + (allComplete ? ' all-complete' : '') + '">' +
            '<span class="subtask-count">' + completedCount + '/' + totalCount + '</span></div>';
    }

    html += '</div>'; // close .task

    html += '</div>'; // close .view-task-card
    return html;
}

// ============================================
// TOGGLE VIEW TASK (Check off in-place)
// ============================================

function toggleViewTask(taskId) {
    // Find and toggle the task in appData
    var found = false;
    appData.rooms.forEach(function(room) {
        if (found) return;
        room.cubbies.forEach(function(cubbyRef) {
            if (found) return;
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;

            cubbyData.subcubbies.forEach(function(sub) {
                if (found) return;
                var task = sub.tasks.find(function(t) { return t.id === taskId; });
                if (task) {
                    task.completed = true;
                    found = true;

                    // Move to end of list (same as toggleTask logic)
                    var taskIndex = sub.tasks.indexOf(task);
                    sub.tasks.splice(taskIndex, 1);
                    sub.tasks.push(task);

                    saveData();
                    syncUpdateTask(task.id, { completed: true, completed_at: new Date().toISOString() });
                    syncUpdatePositions('tasks', buildPositionArray(sub.tasks));
                }
            });
        });
    });

    if (!found) return;

    // Animate and remove the task element from the view
    var taskEl = document.querySelector('[data-view-task-id="' + taskId + '"]');
    if (taskEl) {
        var checkEl = taskEl.querySelector('.checkbox');
        if (checkEl) {
            checkEl.classList.add('checked');
            checkEl.classList.add('pop');
        }
        var textEl = taskEl.querySelector('.task-text');
        if (textEl) textEl.classList.add('completed');

        taskEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        taskEl.style.opacity = '0';
        taskEl.style.transform = 'translateX(20px)';

        setTimeout(function() {
            var groupEl = taskEl.closest('.view-group');
            taskEl.remove();

            // Update group count or remove empty group
            if (groupEl) {
                var remaining = groupEl.querySelectorAll('.view-task-card');
                if (remaining.length === 0) {
                    groupEl.style.transition = 'opacity 0.3s ease';
                    groupEl.style.opacity = '0';
                    setTimeout(function() { groupEl.remove(); }, 300);
                } else {
                    var countEl = groupEl.querySelector('.view-group-count');
                    if (countEl) countEl.textContent = remaining.length;
                }
            }

            // Check if all groups are gone
            var allGroups = document.querySelectorAll('.view-group');
            if (allGroups.length === 0) {
                var container = document.getElementById('views-container');
                container.innerHTML = '<div class="views-empty">All caught up! No tasks remaining.</div>';
            }
        }, 300);
    }
}

// ============================================
// TOGGLE VIEW GROUP (Collapse/Expand)
// ============================================

function toggleViewGroup(groupKey) {
    var groupEl = document.querySelector('[data-view-group="' + groupKey + '"]');
    if (!groupEl) return;

    var items = groupEl.querySelector('.view-group-items');
    var chevron = groupEl.querySelector('.view-group-chevron');

    if (groupEl.classList.contains('collapsed')) {
        groupEl.classList.remove('collapsed');
        items.style.display = 'block';
        chevron.style.transform = 'rotate(90deg)';
    } else {
        groupEl.classList.add('collapsed');
        items.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
}

// ============================================
// SET VIEW FILTER
// ============================================

function setViewFilter(filterKey) {
    activeViewFilter = filterKey;
    renderViews();
}
