// ============================================
// render.js - UI Rendering Functions
// ============================================

// ============================================
// HOME VIEW RENDER
// ============================================

function renderHome() {
    var html = '';
    appData.rooms.forEach(function(room, i) {
        html += '<div class="room-card animate-in delay-' + (i + 1) + '" data-room-id="' + room.id + '">' +
            '<div class="room-card-main" onclick="selectRoom(\'' + room.id + '\')">' +
            '<div class="info"><h2>' + room.name + '</h2><p>' + room.cubbies.length + ' cubbies</p></div>' +
            '<span class="arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg></span></div>' +
            '<div class="room-more-btn" onclick="openRoomMenu(event, \'' + room.id + '\')">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>';
    });
    // Add new room button
    html += '<div class="add-room-btn animate-in delay-' + (appData.rooms.length + 1) + '" onclick="openNewRoomModal()"><span class="plus">+</span><span class="text">new room</span></div>';
    document.getElementById('rooms-container').innerHTML = html;
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
    setCubbyTheme(cubby.color || 'purple');
    document.getElementById('cubby-title').innerHTML = '<h1>' + cubby.name + '</h1>';
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
    var html = '<div class="task ' + (task.expanded ? 'expanded' : '') + (task.completed ? ' completed-task' : '') + (hasSubtasks ? ' has-subtasks' : '') + '" data-task-id="' + task.id + '">' +
        '<div class="checkbox ' + (task.completed ? 'checked' : '') + '" onclick="toggleTask(\'' + task.id + '\')">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="' + theme.bg + '" stroke-width="2.5" stroke-linecap="round"/></svg></div>' +
        '<span class="task-text ' + (task.completed ? 'completed' : '') + '">' + task.text + '</span>';
    
    // Task meta (tags + due date)
    var hasTags = task.tags && task.tags.length > 0;
    var hasDueDate = task.dueDate;
    if (hasTags || hasDueDate) {
        html += '<div class="task-meta">';
        // Tags display
        if (hasTags) {
            html += '<div class="task-tags">';
            task.tags.forEach(function(tag) {
                html += '<span class="task-tag tag-' + tag.color + '">' + tag.text + '</span>';
            });
            html += '</div>';
        }
        // Due date display
        if (hasDueDate) {
            var dueDateInfo = formatDueDate(task.dueDate);
            html += '<span class="task-due-date ' + dueDateInfo.class + '">' + dueDateInfo.text + '</span>';
        }
        html += '</div>';
    }
    
    // Subtask counter (only show if has subtasks)
    if (hasSubtasks) {
        var completedCount = task.subtasks.filter(function(st) { return st.completed; }).length;
        var totalCount = task.subtasks.length;
        var allComplete = completedCount === totalCount;
        html += '<div class="subtask-counter' + (allComplete ? ' all-complete' : '') + '" onclick="toggleTaskExpand(\'' + task.id + '\')">' +
            '<span class="subtask-count">' + completedCount + '/' + totalCount + '</span>' +
            '</div>';
    }
    
    // Always show expand button for adding/viewing subtasks
    html += '<div class="expand-btn ' + (task.expanded ? 'expanded' : '') + '" onclick="toggleTaskExpand(\'' + task.id + '\')">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6L15 12L9 18"/></svg></div>';
    html += '<div class="more-btn" onclick="openTaskMenu(event, \'' + task.id + '\', false)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>';
    
    // Subtasks container (always rendered, visibility controlled by expanded state)
    html += '<div class="subtasks-container ' + (task.expanded ? 'visible' : '') + '" data-parent-task="' + task.id + '">';
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
    // Build subtask meta HTML (tags + due date)
    var subtaskMetaHtml = '';
    var stHasTags = st.tags && st.tags.length > 0;
    var stHasDueDate = st.dueDate;
    if (stHasTags || stHasDueDate) {
        subtaskMetaHtml += '<div class="task-meta">';
        if (stHasTags) {
            subtaskMetaHtml += '<div class="task-tags">';
            st.tags.forEach(function(tag) {
                subtaskMetaHtml += '<span class="task-tag tag-' + tag.color + '">' + tag.text + '</span>';
            });
            subtaskMetaHtml += '</div>';
        }
        if (stHasDueDate) {
            var stDueDateInfo = formatDueDate(st.dueDate);
            subtaskMetaHtml += '<span class="task-due-date ' + stDueDateInfo.class + '">' + stDueDateInfo.text + '</span>';
        }
        subtaskMetaHtml += '</div>';
    }
    
    return '<div class="task subtask ' + (st.completed ? 'completed-task' : '') + '" data-task-id="' + st.id + '" data-parent="' + parentTaskId + '">' +
        '<div class="checkbox small ' + (st.completed ? 'checked' : '') + '" onclick="toggleSubtask(\'' + parentTaskId + '\',\'' + st.id + '\')">' +
        '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="' + theme.bg + '" stroke-width="2.5" stroke-linecap="round"/></svg></div>' +
        '<span class="task-text ' + (st.completed ? 'completed' : '') + '">' + st.text + '</span>' +
        subtaskMetaHtml +
        '<div class="more-btn" onclick="openTaskMenu(event, \'' + st.id + '\', true, \'' + parentTaskId + '\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg></div></div>';
}
