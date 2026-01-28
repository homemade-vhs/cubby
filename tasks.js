// ============================================
// tasks.js - Task & Subtask Operations
// ============================================

// ============================================
// SUBCUBBY TOGGLE
// ============================================

function toggleSubcubby(subcubbyId) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
    subcubby.expanded = !subcubby.expanded;
    var header = document.querySelector('[data-subcubby-id="' + subcubbyId + '"] .subcubby-header');
    var tasks = document.querySelector('[data-subcubby-tasks="' + subcubbyId + '"]');
    if (subcubby.expanded) {
        header.classList.remove('collapsed');
        header.classList.add('expanded');
        tasks.classList.add('visible');
        playSubcubbyExpandSound();
    } else {
        header.classList.remove('expanded');
        header.classList.add('collapsed');
        tasks.classList.remove('visible');
        playSubcubbyCollapseSound();
    }
    saveData();
}

// ============================================
// TASK TOGGLE (Completion)
// ============================================

function toggleTask(taskId) {
    var cubbyData = appData.cubbies[currentCubby.id];
    cubbyData.subcubbies.forEach(function(sub) {
        var taskIndex = sub.tasks.findIndex(function(t) { return t.id === taskId; });
        if (taskIndex !== -1) {
            var task = sub.tasks[taskIndex];
            task.completed = !task.completed;
            var taskEl = document.querySelector('.task[data-task-id="' + taskId + '"]:not(.subtask)');
            var checkbox = taskEl.querySelector('.checkbox');
            var text = taskEl.querySelector('.task-text');
            
            checkbox.classList.add('pop');
            setTimeout(function() { checkbox.classList.remove('pop'); }, 300);
            
            var container = taskEl.closest('.subcubby-tasks-inner');
            var subtasksContainer = taskEl.nextElementSibling;
            var hasSubtasks = subtasksContainer && subtasksContainer.classList.contains('subtasks-container');
            
            if (task.completed) {
                checkbox.classList.add('checked');
                text.classList.add('completed');
                taskEl.classList.add('completed-task');
                playCheckSound();
                
                // Get all elements and their positions before move
                var allElements = Array.from(container.children);
                var positions = new Map();
                allElements.forEach(function(el) {
                    positions.set(el, el.getBoundingClientRect());
                });
                
                // Move in DOM to bottom (before add-task-btn)
                var addBtn = container.querySelector('.add-task-btn');
                container.insertBefore(taskEl, addBtn);
                if (hasSubtasks) {
                    container.insertBefore(subtasksContainer, addBtn);
                }
                
                // Update data
                sub.tasks.splice(taskIndex, 1);
                sub.tasks.push(task);
                saveData();
                
                // FLIP animation
                animateElements(container, positions);
                
            } else {
                checkbox.classList.remove('checked');
                text.classList.remove('completed');
                taskEl.classList.remove('completed-task');
                playUncheckSound();
                
                // Get all elements and their positions before move
                var allElements = Array.from(container.children);
                var positions = new Map();
                allElements.forEach(function(el) {
                    positions.set(el, el.getBoundingClientRect());
                });
                
                // Find where to insert (before first completed task)
                var firstCompletedEl = container.querySelector('.task.completed-task:not(.subtask)');
                if (firstCompletedEl) {
                    container.insertBefore(taskEl, firstCompletedEl);
                    if (hasSubtasks) {
                        container.insertBefore(subtasksContainer, firstCompletedEl);
                    }
                }
                
                // Update data
                sub.tasks.splice(taskIndex, 1);
                var firstCompletedIndex = sub.tasks.findIndex(function(t) { return t.completed; });
                if (firstCompletedIndex === -1) {
                    sub.tasks.push(task);
                } else {
                    sub.tasks.splice(firstCompletedIndex, 0, task);
                }
                saveData();
                
                // FLIP animation
                animateElements(container, positions);
            }
            
            var taskCount = sub.tasks.filter(function(t) { return !t.completed; }).length;
            document.querySelector('[data-subcubby-id="' + sub.id + '"] .count').textContent = taskCount + ' tasks';
        }
    });
}

// ============================================
// SUBTASK TOGGLE (Completion)
// ============================================

function toggleSubtask(parentId, subtaskId) {
    var cubbyData = appData.cubbies[currentCubby.id];
    cubbyData.subcubbies.forEach(function(sub) {
        var task = sub.tasks.find(function(t) { return t.id === parentId; });
        if (task) {
            var subtaskIndex = task.subtasks.findIndex(function(st) { return st.id === subtaskId; });
            if (subtaskIndex !== -1) {
                var subtask = task.subtasks[subtaskIndex];
                subtask.completed = !subtask.completed;
                var subtaskEl = document.querySelector('[data-task-id="' + subtaskId + '"]');
                var checkbox = subtaskEl.querySelector('.checkbox');
                var text = subtaskEl.querySelector('.task-text');
                
                checkbox.classList.add('pop');
                setTimeout(function() { checkbox.classList.remove('pop'); }, 300);
                
                var container = subtaskEl.closest('.subtasks-container');
                
                if (subtask.completed) {
                    checkbox.classList.add('checked');
                    text.classList.add('completed');
                    subtaskEl.classList.add('completed-task');
                    playCheckSound();
                    
                    // Get positions before move
                    var allElements = Array.from(container.querySelectorAll('.subtask'));
                    var positions = new Map();
                    allElements.forEach(function(el) {
                        positions.set(el, el.getBoundingClientRect());
                    });
                    
                    // Move to bottom (before add-subtask-btn)
                    var addBtn = container.querySelector('.add-subtask-btn');
                    container.insertBefore(subtaskEl, addBtn);
                    
                    // Update data
                    task.subtasks.splice(subtaskIndex, 1);
                    task.subtasks.push(subtask);
                    saveData();
                    
                    // Animate
                    animateSubtasks(container, positions);
                    
                } else {
                    checkbox.classList.remove('checked');
                    text.classList.remove('completed');
                    subtaskEl.classList.remove('completed-task');
                    playUncheckSound();
                    
                    // Get positions before move
                    var allElements = Array.from(container.querySelectorAll('.subtask'));
                    var positions = new Map();
                    allElements.forEach(function(el) {
                        positions.set(el, el.getBoundingClientRect());
                    });
                    
                    // Move above first completed
                    var firstCompletedEl = container.querySelector('.subtask.completed-task');
                    if (firstCompletedEl) {
                        container.insertBefore(subtaskEl, firstCompletedEl);
                    }
                    
                    // Update data
                    task.subtasks.splice(subtaskIndex, 1);
                    var firstCompletedIndex = task.subtasks.findIndex(function(st) { return st.completed; });
                    if (firstCompletedIndex === -1) {
                        task.subtasks.push(subtask);
                    } else {
                        task.subtasks.splice(firstCompletedIndex, 0, subtask);
                    }
                    saveData();
                    
                    // Animate
                    animateSubtasks(container, positions);
                }
            }
        }
    });
}

// ============================================
// TASK EXPAND TOGGLE
// ============================================

function toggleTaskExpand(taskId) {
    var cubbyData = appData.cubbies[currentCubby.id];
    cubbyData.subcubbies.forEach(function(sub) {
        var task = sub.tasks.find(function(t) { return t.id === taskId; });
        if (task) {
            task.expanded = !task.expanded;
            var taskEl = document.querySelector('[data-task-id="' + taskId + '"]');
            var expandBtn = taskEl.querySelector('.expand-btn');
            var subtasksContainer = document.querySelector('[data-parent-task="' + taskId + '"]');
            var tasksContainer = document.querySelector('.tasks-container');
            
            if (task.expanded) {
                // Collapse any other expanded tasks first
                document.querySelectorAll('.task.expanded:not(.subtask)').forEach(function(otherTask) {
                    if (otherTask !== taskEl) {
                        var otherId = otherTask.dataset.taskId;
                        otherTask.classList.remove('expanded');
                        var otherBtn = otherTask.querySelector('.expand-btn');
                        if (otherBtn) otherBtn.classList.remove('expanded');
                        var otherContainer = document.querySelector('[data-parent-task="' + otherId + '"]');
                        if (otherContainer) otherContainer.classList.remove('visible');
                        // Update data for other task
                        cubbyData.subcubbies.forEach(function(s) {
                            var t = s.tasks.find(function(tsk) { return tsk.id === otherId; });
                            if (t) t.expanded = false;
                        });
                    }
                });
                
                taskEl.classList.add('expanded');
                expandBtn.classList.add('expanded');
                subtasksContainer.classList.add('visible');
                tasksContainer.classList.add('has-expanded-task');
                playSubtaskExpandSound();
            } else {
                taskEl.classList.remove('expanded');
                expandBtn.classList.remove('expanded');
                subtasksContainer.classList.remove('visible');
                tasksContainer.classList.remove('has-expanded-task');
                playSubtaskCollapseSound();
            }
            saveData();
        }
    });
}

// ============================================
// ADD TASK
// ============================================

function addTask(subcubbyId, text, dueDate, tags) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
    if (!subcubby) return;
    
    // Generate unique ID
    var newId = 't' + Date.now();
    
    // Create new task
    var newTask = {
        id: newId,
        text: text,
        completed: false,
        expanded: false,
        subtasks: [],
        dueDate: dueDate || null,
        tags: tags || []
    };
    
    // Add to beginning of task list
    subcubby.tasks.unshift(newTask);
    
    // Save and re-render
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// ADD SUBTASK
// ============================================

function addSubtask(parentTaskId, text, dueDate, tags) {
    var cubbyData = appData.cubbies[currentCubby.id];
    cubbyData.subcubbies.forEach(function(sub) {
        var task = sub.tasks.find(function(t) { return t.id === parentTaskId; });
        if (task) {
            // Generate unique ID
            var newId = 'st' + Date.now();
            
            // Create new subtask
            var newSubtask = {
                id: newId,
                text: text,
                completed: false,
                dueDate: dueDate || null,
                tags: tags || []
            };
            
            // Initialize subtasks array if needed
            if (!task.subtasks) task.subtasks = [];
            
            // Add to end of subtasks list
            task.subtasks.push(newSubtask);
            
            // Make sure task is expanded to show the new subtask
            task.expanded = true;
            
            // Save and re-render
            saveData();
            renderCubby(currentCubby);
        }
    });
}

// ============================================
// SAVE EDITED TASK
// ============================================

function saveEditedTask(newText, newDueDate, newTags) {
    var cubbyData = appData.cubbies[currentCubby.id];
    
    if (activeMenuIsSubtask) {
        // Edit subtask (including due date and tags)
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === activeMenuParentId; });
            if (parentTask && parentTask.subtasks) {
                var subtask = parentTask.subtasks.find(function(st) { return st.id === activeMenuTaskId; });
                if (subtask) {
                    subtask.text = newText;
                    subtask.dueDate = newDueDate || null;
                    subtask.tags = newTags || [];
                }
            }
        });
    } else {
        // Edit task (including due date and tags)
        cubbyData.subcubbies.forEach(function(sub) {
            var task = sub.tasks.find(function(t) { return t.id === activeMenuTaskId; });
            if (task) {
                task.text = newText;
                task.dueDate = newDueDate || null;
                task.tags = newTags || [];
            }
        });
    }
    
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// DELETE TASK
// ============================================

function deleteTask() {
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();
    var cubbyData = appData.cubbies[currentCubby.id];
    
    if (isSubtask) {
        // Delete subtask
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                parentTask.subtasks = parentTask.subtasks.filter(function(st) { return st.id !== taskId; });
            }
        });
    } else {
        // Delete task
        cubbyData.subcubbies.forEach(function(sub) {
            sub.tasks = sub.tasks.filter(function(t) { return t.id !== taskId; });
        });
    }
    
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// DUPLICATE TASK
// ============================================

function duplicateTask() {
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();
    var cubbyData = appData.cubbies[currentCubby.id];
    
    if (isSubtask) {
        // Duplicate subtask
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var subtask = parentTask.subtasks.find(function(st) { return st.id === taskId; });
                if (subtask) {
                    var newSubtask = {
                        id: 'st' + Date.now(),
                        text: subtask.text,
                        completed: false,
                        dueDate: subtask.dueDate || null,
                        tags: subtask.tags ? subtask.tags.slice() : []
                    };
                    var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                    parentTask.subtasks.splice(index + 1, 0, newSubtask);
                }
            }
        });
    } else {
        // Duplicate task
        cubbyData.subcubbies.forEach(function(sub) {
            var task = sub.tasks.find(function(t) { return t.id === taskId; });
            if (task) {
                var newTask = {
                    id: 't' + Date.now(),
                    text: task.text,
                    completed: false,
                    expanded: false,
                    subtasks: task.subtasks ? task.subtasks.map(function(st) {
                        return {
                            id: 'st' + Date.now() + Math.random().toString(36).substr(2, 5),
                            text: st.text,
                            completed: false,
                            dueDate: st.dueDate || null,
                            tags: st.tags ? st.tags.slice() : []
                        };
                    }) : [],
                    dueDate: task.dueDate || null,
                    tags: task.tags ? task.tags.slice() : []
                };
                var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
                sub.tasks.splice(index + 1, 0, newTask);
            }
        });
    }
    
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// MOVE TASK TO TOP
// ============================================

function moveTaskToTop() {
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();
    var cubbyData = appData.cubbies[currentCubby.id];
    
    if (isSubtask) {
        // Move subtask to top
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                if (index > 0) {
                    var subtask = parentTask.subtasks.splice(index, 1)[0];
                    parentTask.subtasks.unshift(subtask);
                }
            }
        });
    } else {
        // Move task to top
        cubbyData.subcubbies.forEach(function(sub) {
            var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (index > 0) {
                var task = sub.tasks.splice(index, 1)[0];
                sub.tasks.unshift(task);
            }
        });
    }
    
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// MOVE TASK TO BOTTOM
// ============================================

function moveTaskToBottom() {
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();
    var cubbyData = appData.cubbies[currentCubby.id];
    
    if (isSubtask) {
        // Move subtask to bottom
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                if (index !== -1 && index < parentTask.subtasks.length - 1) {
                    var subtask = parentTask.subtasks.splice(index, 1)[0];
                    parentTask.subtasks.push(subtask);
                }
            }
        });
    } else {
        // Move task to bottom
        cubbyData.subcubbies.forEach(function(sub) {
            var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (index !== -1 && index < sub.tasks.length - 1) {
                var task = sub.tasks.splice(index, 1)[0];
                sub.tasks.push(task);
            }
        });
    }
    
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// MOVE TASK TO SECTION
// ============================================

function moveTaskToSection(targetSubcubbyId) {
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    
    var cubbyData = appData.cubbies[currentCubby.id];
    var taskToMove = null;
    
    if (isSubtask) {
        // Find and remove subtask, convert to task
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var subtaskIndex = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                if (subtaskIndex !== -1) {
                    var subtask = parentTask.subtasks.splice(subtaskIndex, 1)[0];
                    taskToMove = { id: subtask.id, text: subtask.text, completed: subtask.completed, expanded: false, subtasks: [] };
                }
            }
        });
    } else {
        // Find and remove task
        cubbyData.subcubbies.forEach(function(sub) {
            var taskIndex = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (taskIndex !== -1) {
                taskToMove = sub.tasks.splice(taskIndex, 1)[0];
            }
        });
    }
    
    if (taskToMove) {
        // Add to target subcubby
        var targetSubcubby = cubbyData.subcubbies.find(function(s) { return s.id === targetSubcubbyId; });
        if (targetSubcubby) {
            targetSubcubby.tasks.unshift(taskToMove);
        }
    }
    
    closeMoveModal();
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// MOVE TASK TO (Different Cubby)
// ============================================

function moveTaskTo(targetCubbyId, targetSubcubbyId) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var taskToMove = null;
    var sourceSubcubbyId = null;
    
    if (activeMenuIsSubtask) {
        // Find and remove subtask, convert to task
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === activeMenuParentId; });
            if (parentTask && parentTask.subtasks) {
                var subtaskIndex = parentTask.subtasks.findIndex(function(st) { return st.id === activeMenuTaskId; });
                if (subtaskIndex !== -1) {
                    var subtask = parentTask.subtasks.splice(subtaskIndex, 1)[0];
                    taskToMove = { id: subtask.id, text: subtask.text, completed: subtask.completed, expanded: false, subtasks: [] };
                }
            }
        });
    } else {
        // Find and remove task
        cubbyData.subcubbies.forEach(function(sub) {
            var taskIndex = sub.tasks.findIndex(function(t) { return t.id === activeMenuTaskId; });
            if (taskIndex !== -1) {
                taskToMove = sub.tasks.splice(taskIndex, 1)[0];
                sourceSubcubbyId = sub.id;
            }
        });
    }
    
    if (taskToMove) {
        // Initialize target cubby data if it doesn't exist
        if (!appData.cubbies[targetCubbyId]) {
            appData.cubbies[targetCubbyId] = { subcubbies: [] };
        }
        var targetCubbyData = appData.cubbies[targetCubbyId];
        if (!targetCubbyData.subcubbies) targetCubbyData.subcubbies = [];
        var targetSubcubby = targetCubbyData.subcubbies.find(function(s) { return s.id === targetSubcubbyId; });
        if (targetSubcubby) {
            targetSubcubby.tasks.unshift(taskToMove);
        }
    }
    
    closeMoveModal();
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// SUBCUBBY CRUD OPERATIONS
// ============================================

function saveEditedSubcubby(newName) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === activeSubcubbyId; });
    if (subcubby) {
        subcubby.name = newName;
        saveData();
        renderCubby(currentCubby);
    }
}

function addNewSubcubby(name) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var newSubcubby = {
        id: 'sub' + Date.now(),
        name: name,
        expanded: true,
        tasks: []
    };
    cubbyData.subcubbies.push(newSubcubby);
    saveData();
    renderCubby(currentCubby);
}

// ============================================
// CUBBY CRUD OPERATIONS
// ============================================

function saveEditedCubbyName(newName) {
    var cubby = currentRoom.cubbies.find(function(c) { return c.id === activeCubbyId; });
    if (cubby) {
        cubby.name = newName;
        saveData();
        renderRoom(currentRoom);
    }
}

function addNewCubby(name) {
    var newCubbyId = 'cubby' + Date.now();
    // Add to room's cubby list
    currentRoom.cubbies.push({
        id: newCubbyId,
        name: name,
        color: 'purple' // default color
    });
    // Initialize cubby data
    appData.cubbies[newCubbyId] = {
        subcubbies: [{
            id: 'sub' + Date.now(),
            name: 'General',
            expanded: true,
            tasks: []
        }]
    };
    saveData();
    renderRoom(currentRoom);
}

// ============================================
// ROOM CRUD OPERATIONS
// ============================================

function saveEditedRoomName(newName) {
    var room = appData.rooms.find(function(r) { return r.id === activeRoomId; });
    if (room) {
        room.name = newName;
        saveData();
        renderHome();
    }
}

function addNewRoom(name) {
    var newRoomId = 'room' + Date.now();
    appData.rooms.push({
        id: newRoomId,
        name: name,
        cubbies: []
    });
    saveData();
    renderHome();
}

// ============================================
// HELPER - Open Modal for First Subcubby
// ============================================

function openModalForFirstSubcubby() {
    // Used by header "new task" button - adds to first subcubby
    var cubbyData = appData.cubbies[currentCubby.id];
    if (cubbyData && cubbyData.subcubbies.length > 0) {
        openModal(cubbyData.subcubbies[0].id);
    }
}
