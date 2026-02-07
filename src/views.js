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

    // Build HTML
    var html = '';
    var totalTasks = 0;

    viewGroups.forEach(function(group) {
        var items = grouped[group.key];
        if (items.length === 0) return;
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

    if (totalTasks === 0) {
        html = '<div class="views-empty">No tasks to show. Add some tasks with due dates to see them here.</div>';
    }

    container.innerHTML = html;
}

// ============================================
// RENDER SINGLE VIEW TASK
// ============================================

function renderViewTask(item, group) {
    var task = item.task;
    var theme = colorThemes[item.cubbyColor] || colorThemes.purple;

    var html = '<div class="view-task" data-view-task-id="' + task.id + '">';

    // Checkbox
    html += '<div class="view-task-check" style="border-color:' + theme.primary + '" onclick="event.stopPropagation(); toggleViewTask(\'' + task.id + '\')">';
    html += '</div>';

    // Content (clickable to navigate)
    html += '<div class="view-task-content" onclick="navigateToTask(\'' + item.roomId + '\', \'' + item.cubbyId + '\', \'' + item.subcubbyId + '\', \'' + task.id + '\')">';
    html += '<span class="view-task-text">' + task.text + '</span>';

    // Meta row (tags + due date)
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
        html += '<div class="view-task-meta">' + metaHtml + '</div>';
    }

    html += '</div>';

    // Location breadcrumb
    html += '<span class="view-task-location">' + item.cubbyName + '</span>';

    html += '</div>';
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
        var checkEl = taskEl.querySelector('.view-task-check');
        if (checkEl) {
            checkEl.style.background = 'var(--cubby-primary, #C77DFF)';
            checkEl.style.borderColor = 'var(--cubby-primary, #C77DFF)';
            checkEl.innerHTML = '<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="#0a0a0f" stroke-width="2.5" stroke-linecap="round"/></svg>';
        }

        taskEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        taskEl.style.opacity = '0';
        taskEl.style.transform = 'translateX(20px)';

        setTimeout(function() {
            var groupEl = taskEl.closest('.view-group');
            taskEl.remove();

            // Update group count or remove empty group
            if (groupEl) {
                var remaining = groupEl.querySelectorAll('.view-task');
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
