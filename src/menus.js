// ============================================
// menus.js - Kebab Menu Functions
// ============================================

// ============================================
// TASK MENU STATE
// ============================================

var activeMenuTaskId = null;
var activeMenuIsSubtask = false;
var activeMenuParentId = null;

// ============================================
// TASK MENU
// ============================================

function openTaskMenu(event, taskId, isSubtask, parentTaskId) {
    event.stopPropagation();
    closeTaskMenu();
    
    activeMenuTaskId = taskId;
    activeMenuIsSubtask = isSubtask || false;
    activeMenuParentId = parentTaskId || null;
    
    var moreBtn = event.currentTarget;
    var rect = moreBtn.getBoundingClientRect();
    
    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'task-menu-backdrop';
    backdrop.onclick = closeTaskMenu;
    document.body.appendChild(backdrop);
    
    // Create menu
    var menu = document.createElement('div');
    menu.className = 'task-menu active';
    menu.innerHTML =
        '<div class="task-menu-item" onclick="editTask()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '<span>Edit</span></div>' +
        '<div class="task-menu-item" onclick="duplicateTask()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
            '<span>Duplicate</span></div>' +
        '<div class="task-menu-item" onclick="moveTaskToTop()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' +
            '<span>Move to top</span></div>' +
        '<div class="task-menu-item" onclick="moveTaskToBottom()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>' +
            '<span>Move to bottom</span></div>' +
        '<div class="task-menu-item" onclick="openMoveTaskModal()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l3 3 3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>' +
            '<span>Move to section</span></div>' +
        '<div class="task-menu-item" onclick="archiveTask()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>' +
            '<span>Archive</span></div>' +
        '<div class="task-menu-item delete" onclick="deleteTask()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '<span>Delete</span></div>';
    
    document.body.appendChild(menu);
    
    // Position menu - check if it would go off screen bottom
    var menuHeight = menu.offsetHeight;
    var spaceBelow = window.innerHeight - rect.bottom;
    var spaceAbove = rect.top;
    
    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        menu.style.top = (rect.top - menuHeight - 4) + 'px';
    } else {
        menu.style.top = (rect.bottom + 4) + 'px';
    }
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeTaskMenu() {
    var backdrop = document.querySelector('.task-menu-backdrop');
    if (backdrop) backdrop.remove();
    var menu = document.querySelector('.task-menu');
    if (menu) menu.remove();
    activeMenuTaskId = null;
    activeMenuIsSubtask = false;
    activeMenuParentId = null;
}

function editTask() {
    // Save values before closeTaskMenu clears them
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();
    
    var taskText = '';
    var taskDueDate = null;
    var taskTags = [];
    var taskMemo = '';
    var cubbyData = appData.cubbies[currentCubby.id];

    if (isSubtask) {
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask) {
                var subtask = parentTask.subtasks.find(function(st) { return st.id === taskId; });
                if (subtask) {
                    taskText = subtask.text;
                    taskDueDate = subtask.dueDate || null;
                    taskTags = subtask.tags ? subtask.tags.slice() : [];
                }
            }
        });
    } else {
        cubbyData.subcubbies.forEach(function(sub) {
            var task = sub.tasks.find(function(t) { return t.id === taskId; });
            if (task) {
                taskText = task.text;
                taskDueDate = task.dueDate || null;
                taskTags = task.tags ? task.tags.slice() : [];
                taskMemo = task.memo || '';
            }
        });
    }

    // Store for saveEditedTask to use
    activeMenuTaskId = taskId;
    activeMenuIsSubtask = isSubtask;
    activeMenuParentId = parentId;

    openEditModal(taskText, taskDueDate, taskTags, taskMemo);
}

// ============================================
// SUBCUBBY MENU STATE & FUNCTIONS
// ============================================

var activeSubcubbyId = null;

function openSubcubbyMenu(event, subcubbyId) {
    event.stopPropagation();
    closeSubcubbyMenu();
    
    activeSubcubbyId = subcubbyId;
    
    var moreBtn = event.currentTarget;
    var rect = moreBtn.getBoundingClientRect();
    
    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'subcubby-menu-backdrop';
    backdrop.onclick = closeSubcubbyMenu;
    document.body.appendChild(backdrop);
    
    // Create menu
    var menu = document.createElement('div');
    menu.className = 'task-menu active';
    menu.id = 'subcubby-menu';
    menu.innerHTML =
        '<div class="task-menu-item" onclick="editSubcubby()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '<span>Edit name</span></div>' +
        '<div class="task-menu-item" onclick="duplicateSubcubby()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
            '<span>Duplicate</span></div>' +
        '<div class="task-menu-item" onclick="moveSubcubbyToTop()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' +
            '<span>Move to top</span></div>' +
        '<div class="task-menu-item" onclick="moveSubcubbyToBottom()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>' +
            '<span>Move to bottom</span></div>' +
        '<div class="task-menu-item" onclick="openMoveSubcubbyModal()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l3 3 3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>' +
            '<span>Move to cubby</span></div>' +
        '<div class="task-menu-item" onclick="archiveSubcubby()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>' +
            '<span>Archive</span></div>' +
        '<div class="task-menu-item delete" onclick="deleteSubcubby()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '<span>Delete</span></div>';

    document.body.appendChild(menu);

    var menuHeight = menu.offsetHeight;
    var spaceBelow = window.innerHeight - rect.bottom;
    
    if (spaceBelow < menuHeight && rect.top > spaceBelow) {
        menu.style.top = (rect.top - menuHeight - 4) + 'px';
    } else {
        menu.style.top = (rect.bottom + 4) + 'px';
    }
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeSubcubbyMenu() {
    var backdrop = document.querySelector('.subcubby-menu-backdrop');
    if (backdrop) backdrop.remove();
    var menu = document.getElementById('subcubby-menu');
    if (menu) menu.remove();
}

function editSubcubby() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();
    
    var cubbyData = appData.cubbies[currentCubby.id];
    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
    if (!subcubby) return;
    
    activeSubcubbyId = subcubbyId;
    
    createModal();
    modalMode = 'editSubcubby';
    document.getElementById('modal-title').textContent = 'Edit Subcubby';
    document.getElementById('task-input').placeholder = 'Enter name...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = subcubby.name;
    setTimeout(function() { input.focus(); input.select(); }, 100);
}

function duplicateSubcubby() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();

    var cubbyData = appData.cubbies[currentCubby.id];
    var index = cubbyData.subcubbies.findIndex(function(s) { return s.id === subcubbyId; });
    if (index === -1) return;

    var original = cubbyData.subcubbies[index];
    var newSubId = generateUUID();
    var newSubcubby = {
        id: newSubId,
        name: original.name + ' (copy)',
        expanded: true,
        tasks: original.tasks.map(function(t) {
            var newTaskId = generateUUID();
            return {
                id: newTaskId,
                text: t.text,
                completed: false,
                expanded: false,
                dueDate: t.dueDate || null,
                tags: t.tags ? t.tags.slice() : [],
                subtasks: t.subtasks ? t.subtasks.map(function(st) {
                    return { id: generateUUID(), text: st.text, completed: false, dueDate: st.dueDate || null, tags: st.tags ? st.tags.slice() : [] };
                }) : []
            };
        })
    };

    cubbyData.subcubbies.splice(index + 1, 0, newSubcubby);
    saveData();

    // Sync: insert subcubby, all tasks, and all subtasks
    syncInsertSubcubby(newSubId, currentCubby.id, newSubcubby.name, index + 1);
    newSubcubby.tasks.forEach(function(t, ti) {
        syncInsertTask(t.id, newSubId, t.text, t.dueDate, t.tags, ti);
        if (t.subtasks) {
            t.subtasks.forEach(function(st, sti) {
                syncInsertSubtask(st.id, t.id, st.text, st.dueDate, st.tags, sti);
            });
        }
    });
    syncUpdatePositions('subcubbies', buildPositionArray(cubbyData.subcubbies));

    renderCubby(currentCubby);
}

function moveSubcubbyToTop() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();

    var cubbyData = appData.cubbies[currentCubby.id];
    var index = cubbyData.subcubbies.findIndex(function(s) { return s.id === subcubbyId; });
    if (index > 0) {
        var subcubby = cubbyData.subcubbies.splice(index, 1)[0];
        cubbyData.subcubbies.unshift(subcubby);
        saveData();
        syncUpdatePositions('subcubbies', buildPositionArray(cubbyData.subcubbies));
        renderCubby(currentCubby);
    }
}

function moveSubcubbyToBottom() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();

    var cubbyData = appData.cubbies[currentCubby.id];
    var index = cubbyData.subcubbies.findIndex(function(s) { return s.id === subcubbyId; });
    if (index !== -1 && index < cubbyData.subcubbies.length - 1) {
        var subcubby = cubbyData.subcubbies.splice(index, 1)[0];
        cubbyData.subcubbies.push(subcubby);
        saveData();
        syncUpdatePositions('subcubbies', buildPositionArray(cubbyData.subcubbies));
        renderCubby(currentCubby);
    }
}

function deleteSubcubby() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();

    showConfirmDialog('Delete subcubby?', 'This will move the subcubby and all its tasks to Trash.', function() {
        var cubbyData = appData.cubbies[currentCubby.id];
        var index = cubbyData.subcubbies.findIndex(function(s) { return s.id === subcubbyId; });
        if (index === -1) return;
        var subcubby = cubbyData.subcubbies.splice(index, 1)[0];
        trashItem('subcubby', subcubby, {
            roomId: currentRoom.id, roomName: currentRoom.name,
            cubbyId: currentCubby.id, cubbyName: currentCubby.name,
            subcubbyId: '', subcubbyName: '',
            parentTaskId: ''
        });
        saveData();
        syncDeleteSubcubby(subcubbyId);
        renderCubby(currentCubby);
    });
}

function moveSubcubbyTo(targetCubbyId) {
    var subcubbyId = activeSubcubbyId;

    var cubbyData = appData.cubbies[currentCubby.id];
    var index = cubbyData.subcubbies.findIndex(function(s) { return s.id === subcubbyId; });
    if (index === -1) return;

    var subcubby = cubbyData.subcubbies.splice(index, 1)[0];

    if (!appData.cubbies[targetCubbyId]) {
        appData.cubbies[targetCubbyId] = { subcubbies: [] };
    }
    var targetCubbyData = appData.cubbies[targetCubbyId];
    if (!targetCubbyData.subcubbies) targetCubbyData.subcubbies = [];
    targetCubbyData.subcubbies.push(subcubby);

    closeMoveModal();
    saveData();
    syncUpdateSubcubby(subcubbyId, { cubby_id: targetCubbyId, position: targetCubbyData.subcubbies.length - 1 });
    renderCubby(currentCubby);
}

// ============================================
// CUBBY MENU STATE & FUNCTIONS
// ============================================

var activeCubbyId = null;

function openCubbyMenu(event, cubbyId) {
    event.stopPropagation();
    closeCubbyMenu();
    
    activeCubbyId = cubbyId;
    
    var moreBtn = event.currentTarget;
    var rect = moreBtn.getBoundingClientRect();
    
    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'cubby-menu-backdrop';
    backdrop.onclick = closeCubbyMenu;
    document.body.appendChild(backdrop);
    
    // Create menu
    var menu = document.createElement('div');
    menu.className = 'task-menu active';
    menu.id = 'cubby-menu';
    menu.innerHTML =
        '<div class="task-menu-item" onclick="editCubbyName()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '<span>Edit name</span></div>' +
        '<div class="task-menu-item" onclick="openEditCubbyColorModal()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>' +
            '<span>Edit color</span></div>' +
        '<div class="task-menu-item" onclick="moveCubbyToTop()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' +
            '<span>Move to top</span></div>' +
        '<div class="task-menu-item" onclick="moveCubbyToBottom()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>' +
            '<span>Move to bottom</span></div>' +
        '<div class="task-menu-item" onclick="openMoveCubbyModal()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l3 3 3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>' +
            '<span>Move to room</span></div>' +
        '<div class="task-menu-item" onclick="archiveCubbyFromMenu()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>' +
            '<span>Archive</span></div>' +
        '<div class="task-menu-item delete" onclick="deleteCubby()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '<span>Delete</span></div>';

    document.body.appendChild(menu);

    var menuHeight = menu.offsetHeight;
    var spaceBelow = window.innerHeight - rect.bottom;
    
    if (spaceBelow < menuHeight && rect.top > spaceBelow) {
        menu.style.top = (rect.top - menuHeight - 4) + 'px';
    } else {
        menu.style.top = (rect.bottom + 4) + 'px';
    }
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeCubbyMenu() {
    var backdrop = document.querySelector('.cubby-menu-backdrop');
    if (backdrop) backdrop.remove();
    var menu = document.getElementById('cubby-menu');
    if (menu) menu.remove();
}

function editCubbyName() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();
    
    var cubby = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!cubby) return;
    
    activeCubbyId = cubbyId;
    
    createModal();
    modalMode = 'editCubbyName';
    document.getElementById('modal-title').textContent = 'Edit Cubby Name';
    document.getElementById('task-input').placeholder = 'Enter name...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = cubby.name;
    setTimeout(function() { input.focus(); input.select(); }, 100);
}

function moveCubbyToTop() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();

    var index = currentRoom.cubbies.findIndex(function(c) { return c.id === cubbyId; });
    if (index > 0) {
        var cubby = currentRoom.cubbies.splice(index, 1)[0];
        currentRoom.cubbies.unshift(cubby);
        saveData();
        syncUpdatePositions('cubbies', buildPositionArray(currentRoom.cubbies));
        renderRoom(currentRoom);
    }
}

function moveCubbyToBottom() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();

    var index = currentRoom.cubbies.findIndex(function(c) { return c.id === cubbyId; });
    if (index !== -1 && index < currentRoom.cubbies.length - 1) {
        var cubby = currentRoom.cubbies.splice(index, 1)[0];
        currentRoom.cubbies.push(cubby);
        saveData();
        syncUpdatePositions('cubbies', buildPositionArray(currentRoom.cubbies));
        renderRoom(currentRoom);
    }
}

function deleteCubby() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();

    showConfirmDialog('Delete cubby?', 'This will move the cubby and all its contents to Trash.', function() {
        var cubbyRef = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
        currentRoom.cubbies = currentRoom.cubbies.filter(function(c) { return c.id !== cubbyId; });
        trashItem('cubby', { ref: cubbyRef, data: appData.cubbies[cubbyId] || { subcubbies: [] } }, {
            roomId: currentRoom.id, roomName: currentRoom.name,
            cubbyId: '', cubbyName: '',
            subcubbyId: '', subcubbyName: '',
            parentTaskId: ''
        });
        delete appData.cubbies[cubbyId];
        saveData();
        syncDeleteCubby(cubbyId);
        renderRoom(currentRoom);
    });
}

function moveCubbyToRoom(targetRoomId) {
    var cubbyId = activeCubbyId;

    var index = currentRoom.cubbies.findIndex(function(c) { return c.id === cubbyId; });
    if (index === -1) return;

    var cubby = currentRoom.cubbies.splice(index, 1)[0];

    var targetRoom = appData.rooms.find(function(r) { return r.id === targetRoomId; });
    if (targetRoom) {
        targetRoom.cubbies.push(cubby);
    }

    closeMoveModal();
    saveData();
    syncUpdateCubby(cubbyId, { workspace_id: targetRoomId, position: targetRoom ? targetRoom.cubbies.length - 1 : 0 });

    // If we were viewing this cubby, go back to room
    if (currentCubby && currentCubby.id === cubbyId) {
        goToRoom();
    } else {
        renderRoom(currentRoom);
    }
}

// ============================================
// CUBBY SETTINGS MENU (Inside Cubby)
// ============================================

function openCubbySettingsMenu(event) {
    event.stopPropagation();
    closeCubbySettingsMenu();

    if (!currentCubby) return;

    var btn = event.currentTarget;
    var rect = btn.getBoundingClientRect();

    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'cubby-settings-menu-backdrop';
    backdrop.onclick = closeCubbySettingsMenu;
    document.body.appendChild(backdrop);

    // Create menu
    var menu = document.createElement('div');
    menu.className = 'task-menu active';
    menu.id = 'cubby-settings-menu';
    menu.innerHTML =
        '<div class="task-menu-item" onclick="editCubbyColorFromSettings()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>' +
            '<span>Color theme</span></div>' +
        '<div class="task-menu-item" onclick="editCubbyDescription()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '<span>Edit description</span></div>' +
        '<div class="task-menu-item" style="opacity:0.3;pointer-events:none">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>' +
            '<span>Share cubby</span></div>' +
        '<div class="task-menu-item" onclick="openMoveCubbyFromSettings()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l3 3 3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>' +
            '<span>Move to room</span></div>' +
        '<div class="task-menu-item" onclick="duplicateCubbyFromSettings()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
            '<span>Duplicate cubby</span></div>' +
        '<div class="task-menu-item" onclick="archiveCubbyFromSettings()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>' +
            '<span>Archive cubby</span></div>' +
        '<div class="task-menu-item delete" onclick="deleteCubbyFromSettings()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '<span>Delete cubby</span></div>';

    document.body.appendChild(menu);

    var menuHeight = menu.offsetHeight;
    var spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow < menuHeight && rect.top > spaceBelow) {
        menu.style.top = (rect.top - menuHeight - 4) + 'px';
    } else {
        menu.style.top = (rect.bottom + 4) + 'px';
    }
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeCubbySettingsMenu() {
    var backdrop = document.querySelector('.cubby-settings-menu-backdrop');
    if (backdrop) backdrop.remove();
    var menu = document.getElementById('cubby-settings-menu');
    if (menu) menu.remove();
}

function editCubbyColorFromSettings() {
    closeCubbySettingsMenu();
    activeCubbyId = currentCubby.id;
    openEditCubbyColorModal();
}

function editCubbyDescription() {
    closeCubbySettingsMenu();

    createModal();
    modalMode = 'editCubbyDescription';
    document.getElementById('modal-title').textContent = 'Edit Description';
    document.getElementById('task-input').placeholder = 'Enter description...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    document.getElementById('memo-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = currentCubby.description || '';
    setTimeout(function() { input.focus(); input.select(); }, 100);
}

function openMoveCubbyFromSettings() {
    closeCubbySettingsMenu();
    activeCubbyId = currentCubby.id;
    openMoveCubbyModal();
}

function duplicateCubbyFromSettings() {
    closeCubbySettingsMenu();
    if (!currentCubby || !currentRoom) return;

    var newCubbyId = generateUUID();
    var cubbyRef = {
        id: newCubbyId,
        name: currentCubby.name + ' (copy)',
        color: currentCubby.color
    };
    if (currentCubby.description) cubbyRef.description = currentCubby.description;
    currentRoom.cubbies.push(cubbyRef);

    // Deep copy cubby data
    var originalData = appData.cubbies[currentCubby.id];
    if (originalData) {
        appData.cubbies[newCubbyId] = JSON.parse(JSON.stringify(originalData));
        // Regenerate all IDs
        appData.cubbies[newCubbyId].subcubbies.forEach(function(sub) {
            sub.id = generateUUID();
            sub.tasks.forEach(function(task) {
                task.id = generateUUID();
                task.completed = false;
                if (task.subtasks) {
                    task.subtasks.forEach(function(st) {
                        st.id = generateUUID();
                        st.completed = false;
                    });
                }
            });
        });
    } else {
        appData.cubbies[newCubbyId] = {
            subcubbies: [{ id: generateUUID(), name: 'General', expanded: true, tasks: [] }]
        };
    }
    saveData();
    renderRoom(currentRoom);
    goToRoom();
}

function deleteCubbyFromSettings() {
    closeCubbySettingsMenu();
    if (!currentCubby || !currentRoom) return;

    showConfirmDialog('Delete cubby?', 'This will move the cubby and all its contents to Trash.', function() {
        var cubbyId = currentCubby.id;
        var cubbyRef = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
        currentRoom.cubbies = currentRoom.cubbies.filter(function(c) { return c.id !== cubbyId; });
        trashItem('cubby', { ref: cubbyRef, data: appData.cubbies[cubbyId] || { subcubbies: [] } }, {
            roomId: currentRoom.id, roomName: currentRoom.name,
            cubbyId: '', cubbyName: '',
            subcubbyId: '', subcubbyName: '',
            parentTaskId: ''
        });
        delete appData.cubbies[cubbyId];
        saveData();
        syncDeleteCubby(cubbyId);
        goToRoom();
    });
}

// ============================================
// ROOM MENU STATE & FUNCTIONS
// ============================================

var activeRoomId = null;

function openRoomMenu(event, roomId) {
    event.stopPropagation();
    closeRoomMenu();
    
    activeRoomId = roomId;
    
    var moreBtn = event.currentTarget;
    var rect = moreBtn.getBoundingClientRect();
    
    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'room-menu-backdrop';
    backdrop.onclick = closeRoomMenu;
    document.body.appendChild(backdrop);
    
    // Create menu
    var menu = document.createElement('div');
    menu.className = 'task-menu active';
    menu.id = 'room-menu';
    menu.innerHTML =
        '<div class="task-menu-item" onclick="editRoomName()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '<span>Edit name</span></div>' +
        '<div class="task-menu-item" onclick="moveRoomToTop()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' +
            '<span>Move to top</span></div>' +
        '<div class="task-menu-item" onclick="moveRoomToBottom()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>' +
            '<span>Move to bottom</span></div>' +
        '<div class="task-menu-item delete" onclick="deleteRoom()">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '<span>Delete</span></div>';
    
    document.body.appendChild(menu);
    
    var menuHeight = menu.offsetHeight;
    var spaceBelow = window.innerHeight - rect.bottom;
    
    if (spaceBelow < menuHeight && rect.top > spaceBelow) {
        menu.style.top = (rect.top - menuHeight - 4) + 'px';
    } else {
        menu.style.top = (rect.bottom + 4) + 'px';
    }
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeRoomMenu() {
    var backdrop = document.querySelector('.room-menu-backdrop');
    if (backdrop) backdrop.remove();
    var menu = document.getElementById('room-menu');
    if (menu) menu.remove();
}

function editRoomName() {
    var roomId = activeRoomId;
    closeRoomMenu();
    
    var room = appData.rooms.find(function(r) { return r.id === roomId; });
    if (!room) return;
    
    activeRoomId = roomId;
    
    createModal();
    modalMode = 'editRoomName';
    document.getElementById('modal-title').textContent = 'Edit Room Name';
    document.getElementById('task-input').placeholder = 'Enter name...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = room.name;
    setTimeout(function() { input.focus(); input.select(); }, 100);
}

function moveRoomToTop() {
    var roomId = activeRoomId;
    closeRoomMenu();

    var index = appData.rooms.findIndex(function(r) { return r.id === roomId; });
    if (index > 0) {
        var room = appData.rooms.splice(index, 1)[0];
        appData.rooms.unshift(room);
        saveData();
        syncUpdatePositions('workspaces', buildPositionArray(appData.rooms));
        renderHome();
    }
}

function moveRoomToBottom() {
    var roomId = activeRoomId;
    closeRoomMenu();

    var index = appData.rooms.findIndex(function(r) { return r.id === roomId; });
    if (index !== -1 && index < appData.rooms.length - 1) {
        var room = appData.rooms.splice(index, 1)[0];
        appData.rooms.push(room);
        saveData();
        syncUpdatePositions('workspaces', buildPositionArray(appData.rooms));
        renderHome();
    }
}

function deleteRoom() {
    var roomId = activeRoomId;
    closeRoomMenu();

    showConfirmDialog('Delete room?', 'This will move the room and all its cubbies to Trash.', function() {
        var room = appData.rooms.find(function(r) { return r.id === roomId; });
        if (room) {
            var cubbyData = [];
            room.cubbies.forEach(function(c) {
                cubbyData.push({ ref: c, data: appData.cubbies[c.id] || { subcubbies: [] } });
                delete appData.cubbies[c.id];
            });
            trashItem('room', { room: { id: room.id, name: room.name, cubbies: [] }, cubbies: cubbyData }, {
                roomId: '', roomName: '',
                cubbyId: '', cubbyName: '',
                subcubbyId: '', subcubbyName: '',
                parentTaskId: ''
            });
        }

        appData.rooms = appData.rooms.filter(function(r) { return r.id !== roomId; });
        saveData();
        syncDeleteWorkspace(roomId);
        renderHome();
    });
}
