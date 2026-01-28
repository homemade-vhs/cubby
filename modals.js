// ============================================
// modals.js - Modal Creation & Handling
// ============================================

// ============================================
// MODAL STATE
// ============================================

var modalSubcubbyId = null;
var modalParentTaskId = null;
var modalMode = 'task'; // 'task', 'subtask', 'edit', 'editSubcubby', 'newSubcubby', 'editCubbyName', 'newCubby', 'editRoomName', 'newRoom'
var modalTags = []; // Current tags being edited
var modalSelectedTagColor = 'blue'; // Default tag color

// ============================================
// CREATE MODAL
// ============================================

function createModal() {
    if (document.getElementById('task-modal')) return;
    var modal = document.createElement('div');
    modal.id = 'task-modal';
    modal.className = 'modal';
    modal.innerHTML =
        '<div class="modal-backdrop" onclick="closeModal()"></div>' +
        '<div class="modal-content">' +
            '<h2 id="modal-title">New Task</h2>' +
            '<input type="text" id="task-input" placeholder="Enter task..." autocomplete="off">' +
            '<div class="date-row" id="date-row">' +
                '<label for="task-date">Due date</label>' +
                '<input type="date" id="task-date">' +
                '<button type="button" class="clear-date-btn" onclick="clearDueDate()">Clear</button>' +
            '</div>' +
            '<div class="tags-row" id="tags-row">' +
                '<label>Tags</label>' +
                '<div class="tags-input-container" id="tags-container">' +
                    '<input type="text" id="tag-input" placeholder="Add tag...">' +
                '</div>' +
                '<div class="tag-colors" id="tag-colors"></div>' +
            '</div>' +
            '<div class="modal-buttons">' +
                '<button class="modal-btn cancel" onclick="closeModal()">Cancel</button>' +
                '<button class="modal-btn confirm" onclick="confirmAddTask()">Add</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // Handle Enter key on task input
    document.getElementById('task-input').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') confirmAddTask();
        if (e.key === 'Escape') closeModal();
    });
    
    // Handle tag input
    document.getElementById('tag-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTagFromInput();
        } else if (e.key === 'Backspace' && this.value === '' && modalTags.length > 0) {
            removeTag(modalTags.length - 1);
        } else if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Render tag color buttons
    renderTagColorButtons();
}

// ============================================
// TAG FUNCTIONS
// ============================================

function renderTagColorButtons() {
    var container = document.getElementById('tag-colors');
    if (!container) return;
    container.innerHTML = '';
    tagColorNames.forEach(function(color) {
        var btn = document.createElement('div');
        btn.className = 'tag-color-btn' + (color === modalSelectedTagColor ? ' selected' : '');
        btn.style.background = tagColors[color].text;
        btn.onclick = function() { selectTagColor(color); };
        container.appendChild(btn);
    });
}

function selectTagColor(color) {
    modalSelectedTagColor = color;
    renderTagColorButtons();
}

function addTagFromInput() {
    var input = document.getElementById('tag-input');
    var text = input.value.trim().replace(/,/g, '');
    if (!text) return;
    
    // Don't add duplicate tags
    var exists = modalTags.some(function(t) { return t.text.toLowerCase() === text.toLowerCase(); });
    if (exists) {
        input.value = '';
        return;
    }
    
    modalTags.push({ text: text, color: modalSelectedTagColor });
    input.value = '';
    renderModalTags();
}

function removeTag(index) {
    modalTags.splice(index, 1);
    renderModalTags();
}

function renderModalTags() {
    var container = document.getElementById('tags-container');
    var input = document.getElementById('tag-input');
    
    // Remove existing tag pills
    var pills = container.querySelectorAll('.tag-pill');
    pills.forEach(function(p) { p.remove(); });
    
    // Add tag pills before input
    modalTags.forEach(function(tag, index) {
        var pill = document.createElement('span');
        pill.className = 'tag-pill tag-' + tag.color;
        pill.innerHTML = tag.text + '<span class="remove-tag" onclick="removeTag(' + index + ')">×</span>';
        container.insertBefore(pill, input);
    });
}

function clearDueDate() {
    document.getElementById('task-date').value = '';
}

// ============================================
// OPEN MODAL - NEW TASK
// ============================================

function openModal(subcubbyId) {
    createModal();
    modalMode = 'task';
    modalSubcubbyId = subcubbyId;
    modalParentTaskId = null;
    modalTags = [];
    modalSelectedTagColor = 'blue';
    document.getElementById('modal-title').textContent = 'New Task';
    document.getElementById('task-input').placeholder = 'Enter task...';
    document.getElementById('date-row').style.display = 'flex';
    document.getElementById('task-date').value = '';
    document.getElementById('tags-row').style.display = 'block';
    document.getElementById('tag-input').value = '';
    renderModalTags();
    renderTagColorButtons();
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = '';
    setTimeout(function() { input.focus(); }, 100);
}

// ============================================
// OPEN MODAL - NEW SUBTASK
// ============================================

function openSubtaskModal(parentTaskId) {
    createModal();
    modalMode = 'subtask';
    modalParentTaskId = parentTaskId;
    modalSubcubbyId = null;
    modalTags = [];
    modalSelectedTagColor = 'blue';
    document.getElementById('modal-title').textContent = 'New Subtask';
    document.getElementById('task-input').placeholder = 'Enter subtask...';
    document.getElementById('date-row').style.display = 'flex';
    document.getElementById('task-date').value = '';
    document.getElementById('tags-row').style.display = 'block';
    document.getElementById('tag-input').value = '';
    renderModalTags();
    renderTagColorButtons();
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = '';
    setTimeout(function() { input.focus(); }, 100);
}

// ============================================
// OPEN MODAL - EDIT TASK
// ============================================

function openEditModal(currentText, currentDueDate, currentTags) {
    createModal();
    modalMode = 'edit';
    modalTags = currentTags || [];
    modalSelectedTagColor = 'blue';
    document.getElementById('modal-title').textContent = activeMenuIsSubtask ? 'Edit Subtask' : 'Edit Task';
    document.getElementById('task-input').placeholder = activeMenuIsSubtask ? 'Enter subtask...' : 'Enter task...';
    // Show date row for both tasks and subtasks now
    document.getElementById('date-row').style.display = 'flex';
    document.getElementById('task-date').value = currentDueDate || '';
    document.getElementById('tags-row').style.display = 'block';
    document.getElementById('tag-input').value = '';
    renderModalTags();
    renderTagColorButtons();
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = currentText;
    setTimeout(function() { input.focus(); input.select(); }, 100);
}

// ============================================
// OPEN MODAL - NEW SUBCUBBY
// ============================================

function openNewSubcubbyModal() {
    createModal();
    modalMode = 'newSubcubby';
    document.getElementById('modal-title').textContent = 'New Subcubby';
    document.getElementById('task-input').placeholder = 'Enter name...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = '';
    setTimeout(function() { input.focus(); }, 100);
}

// ============================================
// OPEN MODAL - NEW CUBBY
// ============================================

function openNewCubbyModal() {
    createModal();
    modalMode = 'newCubby';
    document.getElementById('modal-title').textContent = 'New Cubby';
    document.getElementById('task-input').placeholder = 'Enter name...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = '';
    setTimeout(function() { input.focus(); }, 100);
}

// ============================================
// OPEN MODAL - NEW ROOM
// ============================================

function openNewRoomModal() {
    createModal();
    modalMode = 'newRoom';
    document.getElementById('modal-title').textContent = 'New Room';
    document.getElementById('task-input').placeholder = 'Enter name...';
    document.getElementById('date-row').style.display = 'none';
    document.getElementById('tags-row').style.display = 'none';
    var modal = document.getElementById('task-modal');
    modal.classList.add('active');
    var input = document.getElementById('task-input');
    input.value = '';
    setTimeout(function() { input.focus(); }, 100);
}

// ============================================
// CLOSE MODAL
// ============================================

function closeModal() {
    var modal = document.getElementById('task-modal');
    if (modal) modal.classList.remove('active');
    modalSubcubbyId = null;
    modalParentTaskId = null;
    modalTags = [];
}

// ============================================
// CONFIRM ADD TASK (Main Handler)
// ============================================

function confirmAddTask() {
    var input = document.getElementById('task-input');
    var text = input.value.trim();
    if (!text) return;
    
    var dueDate = document.getElementById('task-date').value || null;
    var tags = modalTags.slice(); // Copy current tags
    
    if (modalMode === 'edit') {
        saveEditedTask(text, dueDate, tags);
    } else if (modalMode === 'subtask') {
        addSubtask(modalParentTaskId, text, dueDate, tags);
    } else if (modalMode === 'editSubcubby') {
        saveEditedSubcubby(text);
    } else if (modalMode === 'newSubcubby') {
        addNewSubcubby(text);
    } else if (modalMode === 'editCubbyName') {
        saveEditedCubbyName(text);
    } else if (modalMode === 'newCubby') {
        addNewCubby(text);
    } else if (modalMode === 'editRoomName') {
        saveEditedRoomName(text);
    } else if (modalMode === 'newRoom') {
        addNewRoom(text);
    } else {
        addTask(modalSubcubbyId, text, dueDate, tags);
    }
    closeModal();
}

// ============================================
// MOVE TASK MODAL
// ============================================

function openMoveTaskModal() {
    // Save values before closeTaskMenu clears them
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();
    
    // Restore for moveTaskTo to use
    activeMenuTaskId = taskId;
    activeMenuIsSubtask = isSubtask;
    activeMenuParentId = parentId;
    
    // Build list of subcubbies in the current cubby only
    var cubbyData = appData.cubbies[currentCubby.id];
    var sectionsList = cubbyData.subcubbies.map(function(sub) {
        return {
            subcubbyName: sub.name,
            subcubbyId: sub.id
        };
    });
    
    // Create move modal
    var existingModal = document.getElementById('move-modal');
    if (existingModal) existingModal.remove();
    
    var modal = document.createElement('div');
    modal.id = 'move-modal';
    modal.className = 'modal active';
    
    var optionsHtml = sectionsList.map(function(s) {
        return '<div class="move-option" onclick="moveTaskToSection(\'' + s.subcubbyId + '\')">' +
            '<span class="move-subcubby">' + s.subcubbyName + '</span></div>';
    }).join('');
    
    modal.innerHTML =
        '<div class="modal-backdrop" onclick="closeMoveModal()"></div>' +
        '<div class="modal-content move-modal-content" onclick="event.stopPropagation()">' +
            '<h2>Move to section...</h2>' +
            '<div class="move-options">' + optionsHtml + '</div>' +
            '<div class="modal-buttons">' +
                '<button class="modal-btn cancel" onclick="closeMoveModal()">Cancel</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
}

// ============================================
// MOVE SUBCUBBY MODAL
// ============================================

function openMoveSubcubbyModal() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();
    activeSubcubbyId = subcubbyId;
    
    // Build list of all cubbies (not subcubbies)
    var cubbiesList = [];
    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            // Don't include current cubby
            if (cubbyRef.id !== currentCubby.id) {
                cubbiesList.push({
                    roomName: room.name,
                    cubbyName: cubbyRef.name,
                    cubbyId: cubbyRef.id
                });
            }
        });
    });
    
    var existingModal = document.getElementById('move-modal');
    if (existingModal) existingModal.remove();
    
    var modal = document.createElement('div');
    modal.id = 'move-modal';
    modal.className = 'modal active';
    
    var optionsHtml = cubbiesList.length > 0 ? cubbiesList.map(function(c) {
        return '<div class="move-option" onclick="event.stopPropagation(); moveSubcubbyTo(\'' + c.cubbyId + '\')">' +
            '<span class="move-path">' + c.roomName + '</span>' +
            '<span class="move-subcubby">' + c.cubbyName + '</span></div>';
    }).join('') : '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px;">No other cubbies available</p>';
    
    modal.innerHTML =
        '<div class="modal-backdrop" onclick="closeMoveModal()"></div>' +
        '<div class="modal-content move-modal-content" onclick="event.stopPropagation()">' +
            '<h2>Move subcubby to...</h2>' +
            '<div class="move-options">' + optionsHtml + '</div>' +
            '<div class="modal-buttons">' +
                '<button class="modal-btn cancel" onclick="closeMoveModal()">Cancel</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
}

// ============================================
// MOVE CUBBY MODAL
// ============================================

function openMoveCubbyModal() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();
    activeCubbyId = cubbyId;
    
    // Build list of other rooms
    var roomsList = appData.rooms.filter(function(r) { return r.id !== currentRoom.id; });
    
    var existingModal = document.getElementById('move-modal');
    if (existingModal) existingModal.remove();
    
    var modal = document.createElement('div');
    modal.id = 'move-modal';
    modal.className = 'modal active';
    
    var optionsHtml = roomsList.length > 0 ? roomsList.map(function(r) {
        return '<div class="move-option" onclick="moveCubbyToRoom(\'' + r.id + '\')">' +
            '<span class="move-subcubby">' + r.name + '</span></div>';
    }).join('') : '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px;">No other rooms available</p>';
    
    modal.innerHTML =
        '<div class="modal-backdrop" onclick="closeMoveModal()"></div>' +
        '<div class="modal-content move-modal-content" onclick="event.stopPropagation()">' +
            '<h2>Move cubby to...</h2>' +
            '<div class="move-options">' + optionsHtml + '</div>' +
            '<div class="modal-buttons">' +
                '<button class="modal-btn cancel" onclick="closeMoveModal()">Cancel</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
}

// ============================================
// CLOSE MOVE MODAL
// ============================================

function closeMoveModal() {
    var modal = document.getElementById('move-modal');
    if (modal) modal.remove();
}

// ============================================
// COLOR MODAL (for cubby color)
// ============================================

function openEditCubbyColorModal() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();
    activeCubbyId = cubbyId;
    
    var cubby = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!cubby) return;
    
    var existingModal = document.getElementById('color-modal');
    if (existingModal) existingModal.remove();
    
    var modal = document.createElement('div');
    modal.id = 'color-modal';
    modal.className = 'modal active';
    
    var colorOptions = Object.keys(colorThemes).map(function(colorName) {
        var theme = colorThemes[colorName];
        var selected = cubby.color === colorName ? ' selected' : '';
        return '<div class="color-option' + selected + '" onclick="setCubbyColor(\'' + colorName + '\')" style="background:' + theme.card + ';border:2px solid ' + theme.border + ';">' +
            '<span style="color:' + theme.text + '">' + colorName.charAt(0).toUpperCase() + colorName.slice(1) + '</span></div>';
    }).join('');
    
    modal.innerHTML =
        '<div class="modal-backdrop" onclick="closeColorModal()"></div>' +
        '<div class="modal-content" onclick="event.stopPropagation()">' +
            '<h2>Choose Color</h2>' +
            '<div class="color-options">' + colorOptions + '</div>' +
            '<div class="modal-buttons">' +
                '<button class="modal-btn cancel" onclick="closeColorModal()">Cancel</button>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
}

function closeColorModal() {
    var modal = document.getElementById('color-modal');
    if (modal) modal.remove();
}

function setCubbyColor(colorName) {
    var cubby = currentRoom.cubbies.find(function(c) { return c.id === activeCubbyId; });
    if (cubby) {
        cubby.color = colorName;
        saveData();
        renderRoom(currentRoom);
    }
    closeColorModal();
}
