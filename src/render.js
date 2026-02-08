// ============================================
// render.js - UI Rendering Functions
// ============================================

// ============================================
// HOME VIEW RENDER
// ============================================

function renderHome(skipAnimation) {
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
