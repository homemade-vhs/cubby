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
                task.completed_at = new Date().toISOString();
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
                syncUpdateTask(task.id, { completed: true, completed_at: new Date().toISOString() });
                syncUpdatePositions('tasks', buildPositionArray(sub.tasks));

                // FLIP animation
                animateElements(container, positions);

            } else {
                checkbox.classList.remove('checked');
                text.classList.remove('completed');
                taskEl.classList.remove('completed-task');
                task.completed_at = null;
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
                syncUpdateTask(task.id, { completed: false, completed_at: null });
                syncUpdatePositions('tasks', buildPositionArray(sub.tasks));

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
                    subtask.completed_at = new Date().toISOString();
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
                    syncUpdateSubtask(subtask.id, { completed: true });
                    syncUpdatePositions('subtasks', buildPositionArray(task.subtasks));

                    // Animate
                    animateSubtasks(container, positions);

                } else {
                    checkbox.classList.remove('checked');
                    text.classList.remove('completed');
                    subtaskEl.classList.remove('completed-task');
                    subtask.completed_at = null;
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
                    syncUpdateSubtask(subtask.id, { completed: false });
                    syncUpdatePositions('subtasks', buildPositionArray(task.subtasks));

                    // Animate
                    animateSubtasks(container, positions);
                }

                // Update subtask counter and progress bar on parent task
                var parentEl = document.querySelector('.task[data-task-id="' + parentId + '"]:not(.subtask)');
                if (parentEl) {
                    var doneCount = task.subtasks.filter(function(st) { return st.completed; }).length;
                    var totalCount = task.subtasks.length;
                    var allDone = doneCount === totalCount;

                    // Update counter
                    var counter = parentEl.querySelector('.subtask-counter');
                    if (counter) {
                        counter.querySelector('.subtask-count').textContent = doneCount + '/' + totalCount;
                        if (allDone) {
                            counter.classList.add('all-complete');
                        } else {
                            counter.classList.remove('all-complete');
                        }
                    }

                    // Update progress bar
                    var progressFill = parentEl.querySelector('.task-progress-fill');
                    if (progressFill) {
                        var pct = Math.round((doneCount / totalCount) * 100);
                        progressFill.style.width = pct + '%';
                        if (allDone) {
                            progressFill.classList.add('complete');
                        } else {
                            progressFill.classList.remove('complete');
                        }
                    }
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

function addTask(subcubbyId, text, dueDate, tags, memo) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
    if (!subcubby) return;

    // Generate unique ID
    var newId = generateUUID();

    // Create new task
    var newTask = {
        id: newId,
        text: text,
        completed: false,
        expanded: false,
        subtasks: [],
        dueDate: dueDate || null,
        tags: tags || [],
        memo: memo || ''
    };

    // Add to beginning of task list
    subcubby.tasks.unshift(newTask);

    // Save and re-render
    saveData();
    syncInsertTask(newId, subcubbyId, text, dueDate, tags, memo, 0);
    syncUpdatePositions('tasks', buildPositionArray(subcubby.tasks));
    renderCubby(currentCubby);
}

// ============================================
// ADD TASK TO LOCATION (From Nav Bar)
// ============================================

function addTaskToLocation(location, text, dueDate, tags, memo) {
    var cubbyData = appData.cubbies[location.cubbyId];
    if (!cubbyData) return;

    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === location.subcubbyId; });
    if (!subcubby) return;

    // Generate unique ID
    var newId = generateUUID();

    // Create new task
    var newTask = {
        id: newId,
        text: text,
        completed: false,
        expanded: false,
        subtasks: [],
        dueDate: dueDate || null,
        tags: tags || [],
        memo: memo || ''
    };

    // Add to beginning of task list
    subcubby.tasks.unshift(newTask);

    // Save and sync
    saveData();
    syncInsertTask(newId, location.subcubbyId, text, dueDate, tags, memo, 0);
    syncUpdatePositions('tasks', buildPositionArray(subcubby.tasks));

    // Only re-render if we're currently viewing this cubby
    if (currentCubby && currentCubby.id === location.cubbyId) {
        renderCubby(currentCubby);
    }
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
            var newId = generateUUID();

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

            // Make sure task stays expanded
            task.expanded = true;

            // Save data
            saveData();
            syncInsertSubtask(newId, parentTaskId, text, dueDate, tags, task.subtasks.length - 1);
            
            // Insert just the new subtask element (don't rebuild entire container)
            var subtasksContainer = document.querySelector('[data-parent-task="' + parentTaskId + '"]');
            if (subtasksContainer) {
                var theme = colorThemes[currentCubby.color] || colorThemes.purple;

                // Create new subtask element
                var temp = document.createElement('div');
                temp.innerHTML = renderSubtask(newSubtask, parentTaskId, theme);
                var newEl = temp.firstChild;

                // Insert before the add-subtask button
                var addBtn = subtasksContainer.querySelector('.add-subtask-btn');
                subtasksContainer.insertBefore(newEl, addBtn);

                // Update counter and progress on parent task
                var taskEl = document.querySelector('[data-task-id="' + parentTaskId + '"]:not(.subtask)');
                if (taskEl) {
                    var completedCount = task.subtasks.filter(function(st) { return st.completed; }).length;
                    var totalCount = task.subtasks.length;
                    var allComplete = completedCount === totalCount;
                    var pct = Math.round((completedCount / totalCount) * 100);

                    var counter = taskEl.querySelector('.subtask-counter');
                    if (counter) {
                        // Update existing counter
                        counter.querySelector('.subtask-count').textContent = completedCount + '/' + totalCount;
                        counter.classList.toggle('all-complete', allComplete);
                    } else {
                        // First subtask — create counter and progress bar
                        var expandBtn = taskEl.querySelector('.expand-btn');
                        var progDiv = document.createElement('div');
                        progDiv.className = 'task-progress';
                        progDiv.innerHTML = '<div class="task-progress-fill" style="width:' + pct + '%"></div>';
                        taskEl.insertBefore(progDiv, expandBtn);
                        var counterDiv = document.createElement('div');
                        counterDiv.className = 'subtask-counter';
                        counterDiv.setAttribute('onclick', "toggleTaskExpand('" + parentTaskId + "')");
                        counterDiv.innerHTML = '<span class="subtask-count">' + completedCount + '/' + totalCount + '</span>';
                        taskEl.insertBefore(counterDiv, expandBtn);
                        taskEl.classList.add('has-subtasks');
                    }

                    // Update progress bar
                    var progressFill = taskEl.querySelector('.task-progress-fill');
                    if (progressFill) {
                        progressFill.style.width = pct + '%';
                        progressFill.classList.toggle('complete', allComplete);
                    }
                }
            }
        }
    });
}

// ============================================
// SAVE EDITED TASK
// ============================================

function saveEditedTask(newText, newDueDate, newTags, newMemo) {
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
        syncUpdateSubtask(activeMenuTaskId, { text: newText, due_date: newDueDate || null, tags: newTags || [] });
    } else {
        // Edit task (including due date, tags, and memo)
        cubbyData.subcubbies.forEach(function(sub) {
            var task = sub.tasks.find(function(t) { return t.id === activeMenuTaskId; });
            if (task) {
                task.text = newText;
                task.dueDate = newDueDate || null;
                task.tags = newTags || [];
                task.memo = newMemo || '';
            }
        });
        syncUpdateTask(activeMenuTaskId, { text: newText, due_date: newDueDate || null, tags: newTags || [], memo: newMemo || '' });
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

    var itemLabel = isSubtask ? 'subtask' : 'task';
    showConfirmDialog('Delete ' + itemLabel + '?', 'This will move the ' + itemLabel + ' to Trash.', function() {
        var cubbyData = appData.cubbies[currentCubby.id];

        if (isSubtask) {
            cubbyData.subcubbies.forEach(function(sub) {
                var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
                if (parentTask && parentTask.subtasks) {
                    var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                    if (index !== -1) {
                        var subtask = parentTask.subtasks.splice(index, 1)[0];
                        trashItem('subtask', subtask, {
                            roomId: currentRoom.id, roomName: currentRoom.name,
                            cubbyId: currentCubby.id, cubbyName: currentCubby.name,
                            subcubbyId: sub.id, subcubbyName: sub.name,
                            parentTaskId: parentId
                        });
                    }
                }
            });
            syncDeleteSubtask(taskId);
        } else {
            cubbyData.subcubbies.forEach(function(sub) {
                var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
                if (index !== -1) {
                    var task = sub.tasks.splice(index, 1)[0];
                    trashItem('task', task, {
                        roomId: currentRoom.id, roomName: currentRoom.name,
                        cubbyId: currentCubby.id, cubbyName: currentCubby.name,
                        subcubbyId: sub.id, subcubbyName: sub.name,
                        parentTaskId: ''
                    });
                }
            });
            syncDeleteTask(taskId);
        }

        saveData();
        renderCubby(currentCubby);
    });
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
                    var newSubtaskId = generateUUID();
                    var newSubtask = {
                        id: newSubtaskId,
                        text: subtask.text,
                        completed: false,
                        dueDate: subtask.dueDate || null,
                        tags: subtask.tags ? subtask.tags.slice() : []
                    };
                    var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                    parentTask.subtasks.splice(index + 1, 0, newSubtask);
                    syncInsertSubtask(newSubtaskId, parentId, newSubtask.text, newSubtask.dueDate, newSubtask.tags, index + 1);
                    syncUpdatePositions('subtasks', buildPositionArray(parentTask.subtasks));
                }
            }
        });
    } else {
        // Duplicate task
        cubbyData.subcubbies.forEach(function(sub) {
            var task = sub.tasks.find(function(t) { return t.id === taskId; });
            if (task) {
                var newTaskId = generateUUID();
                var newTask = {
                    id: newTaskId,
                    text: task.text,
                    completed: false,
                    expanded: false,
                    subtasks: task.subtasks ? task.subtasks.map(function(st) {
                        return {
                            id: generateUUID(),
                            text: st.text,
                            completed: false,
                            dueDate: st.dueDate || null,
                            tags: st.tags ? st.tags.slice() : []
                        };
                    }) : [],
                    dueDate: task.dueDate || null,
                    tags: task.tags ? task.tags.slice() : [],
                    memo: task.memo || ''
                };
                var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
                sub.tasks.splice(index + 1, 0, newTask);

                // Sync the new task
                syncInsertTask(newTaskId, sub.id, newTask.text, newTask.dueDate, newTask.tags, newTask.memo, index + 1);
                // Sync all new subtasks
                newTask.subtasks.forEach(function(st, sti) {
                    syncInsertSubtask(st.id, newTaskId, st.text, st.dueDate, st.tags, sti);
                });
                syncUpdatePositions('tasks', buildPositionArray(sub.tasks));
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
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                if (index > 0) {
                    var subtask = parentTask.subtasks.splice(index, 1)[0];
                    parentTask.subtasks.unshift(subtask);
                    syncUpdatePositions('subtasks', buildPositionArray(parentTask.subtasks));
                }
            }
        });
    } else {
        cubbyData.subcubbies.forEach(function(sub) {
            var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (index > 0) {
                var task = sub.tasks.splice(index, 1)[0];
                sub.tasks.unshift(task);
                syncUpdatePositions('tasks', buildPositionArray(sub.tasks));
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
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                if (index !== -1 && index < parentTask.subtasks.length - 1) {
                    var subtask = parentTask.subtasks.splice(index, 1)[0];
                    parentTask.subtasks.push(subtask);
                    syncUpdatePositions('subtasks', buildPositionArray(parentTask.subtasks));
                }
            }
        });
    } else {
        cubbyData.subcubbies.forEach(function(sub) {
            var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (index !== -1 && index < sub.tasks.length - 1) {
                var task = sub.tasks.splice(index, 1)[0];
                sub.tasks.push(task);
                syncUpdatePositions('tasks', buildPositionArray(sub.tasks));
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
                    // Delete from subtasks table, will be re-inserted as task
                    syncDeleteSubtask(taskId);
                }
            }
        });
    } else {
        // Find and remove task
        cubbyData.subcubbies.forEach(function(sub) {
            var taskIndex = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (taskIndex !== -1) {
                taskToMove = sub.tasks.splice(taskIndex, 1)[0];
                // Update the task's subcubby_id in Supabase
                syncUpdateTask(taskId, { subcubby_id: targetSubcubbyId, position: 0 });
            }
        });
    }

    if (taskToMove) {
        var targetSubcubby = cubbyData.subcubbies.find(function(s) { return s.id === targetSubcubbyId; });
        if (targetSubcubby) {
            targetSubcubby.tasks.unshift(taskToMove);
            if (isSubtask) {
                // Re-insert as a task in Supabase
                syncInsertTask(taskToMove.id, targetSubcubbyId, taskToMove.text, null, [], 0);
            }
            syncUpdatePositions('tasks', buildPositionArray(targetSubcubby.tasks));
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

    if (activeMenuIsSubtask) {
        // Find and remove subtask, convert to task
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === activeMenuParentId; });
            if (parentTask && parentTask.subtasks) {
                var subtaskIndex = parentTask.subtasks.findIndex(function(st) { return st.id === activeMenuTaskId; });
                if (subtaskIndex !== -1) {
                    var subtask = parentTask.subtasks.splice(subtaskIndex, 1)[0];
                    taskToMove = { id: subtask.id, text: subtask.text, completed: subtask.completed, expanded: false, subtasks: [] };
                    syncDeleteSubtask(activeMenuTaskId);
                }
            }
        });
    } else {
        // Find and remove task
        cubbyData.subcubbies.forEach(function(sub) {
            var taskIndex = sub.tasks.findIndex(function(t) { return t.id === activeMenuTaskId; });
            if (taskIndex !== -1) {
                taskToMove = sub.tasks.splice(taskIndex, 1)[0];
                syncUpdateTask(activeMenuTaskId, { subcubby_id: targetSubcubbyId, position: 0 });
            }
        });
    }

    if (taskToMove) {
        if (!appData.cubbies[targetCubbyId]) {
            appData.cubbies[targetCubbyId] = { subcubbies: [] };
        }
        var targetCubbyData = appData.cubbies[targetCubbyId];
        if (!targetCubbyData.subcubbies) targetCubbyData.subcubbies = [];
        var targetSubcubby = targetCubbyData.subcubbies.find(function(s) { return s.id === targetSubcubbyId; });
        if (targetSubcubby) {
            targetSubcubby.tasks.unshift(taskToMove);
            if (activeMenuIsSubtask) {
                syncInsertTask(taskToMove.id, targetSubcubbyId, taskToMove.text, null, [], 0);
            }
            syncUpdatePositions('tasks', buildPositionArray(targetSubcubby.tasks));
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
        syncUpdateSubcubby(activeSubcubbyId, { name: newName });
        renderCubby(currentCubby);
    }
}

function addNewSubcubby(name) {
    var cubbyData = appData.cubbies[currentCubby.id];
    var newId = generateUUID();
    var newSubcubby = {
        id: newId,
        name: name,
        expanded: true,
        tasks: []
    };
    cubbyData.subcubbies.push(newSubcubby);
    saveData();
    syncInsertSubcubby(newId, currentCubby.id, name, cubbyData.subcubbies.length - 1);
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
        syncUpdateCubby(activeCubbyId, { name: newName });
        renderRoom(currentRoom);
    }
}

function addNewCubby(name, color, roomId, description) {
    color = color || 'purple';
    var targetRoom = roomId ? appData.rooms.find(function(r) { return r.id === roomId; }) : currentRoom;
    if (!targetRoom) targetRoom = currentRoom;

    var newCubbyId = generateUUID();
    var newSubId = generateUUID();
    // Add to room's cubby list
    var cubbyRef = {
        id: newCubbyId,
        name: name,
        color: color
    };
    if (description) cubbyRef.description = description;
    targetRoom.cubbies.push(cubbyRef);
    // Initialize cubby data
    appData.cubbies[newCubbyId] = {
        subcubbies: [{
            id: newSubId,
            name: 'General',
            expanded: true,
            tasks: []
        }]
    };
    saveData();
    syncInsertCubby(newCubbyId, targetRoom.id, name, color, targetRoom.cubbies.length - 1);
    syncInsertSubcubby(newSubId, newCubbyId, 'General', 0);
    // Re-render the appropriate room
    if (currentRoom && currentRoom.id === targetRoom.id) {
        renderRoom(currentRoom);
    }
}

// ============================================
// ROOM CRUD OPERATIONS
// ============================================

function saveEditedRoomName(newName) {
    var room = appData.rooms.find(function(r) { return r.id === activeRoomId; });
    if (room) {
        room.name = newName;
        saveData();
        syncUpdateWorkspace(activeRoomId, { name: newName });
        renderHome();
    }
}

function addNewRoom(name) {
    var newRoomId = generateUUID();
    appData.rooms.push({
        id: newRoomId,
        name: name,
        cubbies: []
    });
    saveData();
    // Need user ID for workspace insert
    getCurrentUser().then(function(user) {
        if (user) {
            syncInsertWorkspace(newRoomId, user.id, name, appData.rooms.length - 1);
        }
    });
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

// ============================================
// CLICK OUTSIDE TO COLLAPSE EXPANDED TASK
// ============================================

document.addEventListener('click', function(e) {
    // Only handle if we're in focus mode (has expanded task)
    var tasksContainer = document.querySelector('.tasks-container.has-expanded-task');
    if (!tasksContainer) return;
    
    // Find the expanded task
    var expandedTask = document.querySelector('.task.expanded:not(.subtask)');
    if (!expandedTask) return;
    
    // Get the expanded task's subtasks container
    var taskId = expandedTask.dataset.taskId;
    var subtasksContainer = document.querySelector('[data-parent-task="' + taskId + '"]');
    
    // Check if click is inside the expanded task or its subtasks
    var clickedInsideTask = expandedTask.contains(e.target);
    var clickedInsideSubtasks = subtasksContainer && subtasksContainer.contains(e.target);
    
    // Check if click is on header buttons (back, search, new task)
    var clickedHeader = e.target.closest('.cubby-header');

    // Check if click is on the nav bar
    var clickedNavBar = e.target.closest('.bottom-nav');

    // If clicked outside task area and not on header or nav bar, collapse
    if (!clickedInsideTask && !clickedInsideSubtasks && !clickedHeader && !clickedNavBar) {
        toggleTaskExpand(taskId);
    }
});

// ============================================
// ARCHIVE FUNCTIONS
// ============================================

function getItemSource(taskId, isSubtask, parentId) {
    var source = { roomId: '', roomName: '', cubbyId: '', cubbyName: '', subcubbyId: '', subcubbyName: '', parentTaskId: '' };
    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;
            cubbyData.subcubbies.forEach(function(sub) {
                if (isSubtask) {
                    sub.tasks.forEach(function(t) {
                        if (t.id === parentId && t.subtasks) {
                            var st = t.subtasks.find(function(s) { return s.id === taskId; });
                            if (st) {
                                source = { roomId: room.id, roomName: room.name, cubbyId: cubbyRef.id, cubbyName: cubbyRef.name, subcubbyId: sub.id, subcubbyName: sub.name, parentTaskId: parentId };
                            }
                        }
                    });
                } else {
                    var task = sub.tasks.find(function(t) { return t.id === taskId; });
                    if (task) {
                        source = { roomId: room.id, roomName: room.name, cubbyId: cubbyRef.id, cubbyName: cubbyRef.name, subcubbyId: sub.id, subcubbyName: sub.name, parentTaskId: '' };
                    }
                }
            });
        });
    });
    return source;
}

function archiveTask() {
    var taskId = activeMenuTaskId;
    var isSubtask = activeMenuIsSubtask;
    var parentId = activeMenuParentId;
    closeTaskMenu();

    var cubbyData = appData.cubbies[currentCubby.id];
    var archivedItem = null;

    if (isSubtask) {
        cubbyData.subcubbies.forEach(function(sub) {
            var parentTask = sub.tasks.find(function(t) { return t.id === parentId; });
            if (parentTask && parentTask.subtasks) {
                var index = parentTask.subtasks.findIndex(function(st) { return st.id === taskId; });
                if (index !== -1) {
                    var subtask = parentTask.subtasks.splice(index, 1)[0];
                    archivedItem = {
                        type: 'subtask',
                        item: subtask,
                        archivedAt: new Date().toISOString(),
                        source: {
                            roomId: currentRoom.id, roomName: currentRoom.name,
                            cubbyId: currentCubby.id, cubbyName: currentCubby.name,
                            subcubbyId: sub.id, subcubbyName: sub.name,
                            parentTaskId: parentId
                        }
                    };
                }
            }
        });
    } else {
        cubbyData.subcubbies.forEach(function(sub) {
            var index = sub.tasks.findIndex(function(t) { return t.id === taskId; });
            if (index !== -1) {
                var task = sub.tasks.splice(index, 1)[0];
                archivedItem = {
                    type: 'task',
                    item: task,
                    archivedAt: new Date().toISOString(),
                    source: {
                        roomId: currentRoom.id, roomName: currentRoom.name,
                        cubbyId: currentCubby.id, cubbyName: currentCubby.name,
                        subcubbyId: sub.id, subcubbyName: sub.name,
                        parentTaskId: ''
                    }
                };
            }
        });
    }

    if (archivedItem) {
        appData.archive.push(archivedItem);
        saveData();
        renderCubby(currentCubby);
    }
}

function archiveSubcubby() {
    var subcubbyId = activeSubcubbyId;
    closeSubcubbyMenu();

    var cubbyData = appData.cubbies[currentCubby.id];
    var index = cubbyData.subcubbies.findIndex(function(s) { return s.id === subcubbyId; });
    if (index === -1) return;

    var subcubby = cubbyData.subcubbies.splice(index, 1)[0];
    appData.archive.push({
        type: 'subcubby',
        item: subcubby,
        archivedAt: new Date().toISOString(),
        source: {
            roomId: currentRoom.id, roomName: currentRoom.name,
            cubbyId: currentCubby.id, cubbyName: currentCubby.name,
            subcubbyId: '', subcubbyName: '',
            parentTaskId: ''
        }
    });

    saveData();
    renderCubby(currentCubby);
}

function archiveCubbyFromMenu() {
    var cubbyId = activeCubbyId;
    closeCubbyMenu();

    var cubbyRef = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!cubbyRef) return;

    // Remove from room
    currentRoom.cubbies = currentRoom.cubbies.filter(function(c) { return c.id !== cubbyId; });

    // Archive it
    appData.archive.push({
        type: 'cubby',
        item: { ref: cubbyRef, data: appData.cubbies[cubbyId] || { subcubbies: [] } },
        archivedAt: new Date().toISOString(),
        source: {
            roomId: currentRoom.id, roomName: currentRoom.name,
            cubbyId: '', cubbyName: '',
            subcubbyId: '', subcubbyName: '',
            parentTaskId: ''
        }
    });

    // Remove cubby data
    delete appData.cubbies[cubbyId];
    saveData();
    renderRoom(currentRoom);
}

function archiveCubbyFromSettings() {
    closeCubbySettingsMenu();
    if (!currentCubby || !currentRoom) return;

    var cubbyId = currentCubby.id;
    var cubbyRef = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!cubbyRef) return;

    currentRoom.cubbies = currentRoom.cubbies.filter(function(c) { return c.id !== cubbyId; });

    appData.archive.push({
        type: 'cubby',
        item: { ref: cubbyRef, data: appData.cubbies[cubbyId] || { subcubbies: [] } },
        archivedAt: new Date().toISOString(),
        source: {
            roomId: currentRoom.id, roomName: currentRoom.name,
            cubbyId: '', cubbyName: '',
            subcubbyId: '', subcubbyName: '',
            parentTaskId: ''
        }
    });

    delete appData.cubbies[cubbyId];
    saveData();
    goToRoom();
}

// ============================================
// TRASH FUNCTIONS
// ============================================

function trashItem(type, item, source) {
    appData.trash.push({
        type: type,
        item: item,
        deletedAt: new Date().toISOString(),
        source: source
    });
}

function restoreFromTrash(trashIndex) {
    var entry = appData.trash[trashIndex];
    if (!entry) return;

    if (entry.type === 'task') {
        var cubbyData = appData.cubbies[entry.source.cubbyId];
        if (cubbyData) {
            var sub = cubbyData.subcubbies.find(function(s) { return s.id === entry.source.subcubbyId; });
            if (sub) {
                entry.item.completed = false;
                entry.item.completed_at = null;
                sub.tasks.unshift(entry.item);
            }
        }
    } else if (entry.type === 'subtask') {
        var cubbyData = appData.cubbies[entry.source.cubbyId];
        if (cubbyData) {
            cubbyData.subcubbies.forEach(function(sub) {
                var parentTask = sub.tasks.find(function(t) { return t.id === entry.source.parentTaskId; });
                if (parentTask) {
                    if (!parentTask.subtasks) parentTask.subtasks = [];
                    entry.item.completed = false;
                    entry.item.completed_at = null;
                    parentTask.subtasks.unshift(entry.item);
                }
            });
        }
    } else if (entry.type === 'subcubby') {
        var cubbyData = appData.cubbies[entry.source.cubbyId];
        if (cubbyData) {
            cubbyData.subcubbies.push(entry.item);
        }
    } else if (entry.type === 'cubby') {
        var room = appData.rooms.find(function(r) { return r.id === entry.source.roomId; });
        if (room) {
            room.cubbies.push(entry.item.ref);
            appData.cubbies[entry.item.ref.id] = entry.item.data;
        }
    } else if (entry.type === 'room') {
        appData.rooms.push(entry.item.room);
        entry.item.cubbies.forEach(function(c) {
            appData.cubbies[c.ref.id] = c.data;
        });
    }

    appData.trash.splice(trashIndex, 1);
    saveData();
}

function restoreFromArchive(archiveIndex) {
    var entry = appData.archive[archiveIndex];
    if (!entry) return;

    if (entry.type === 'task') {
        var cubbyData = appData.cubbies[entry.source.cubbyId];
        if (cubbyData) {
            var sub = cubbyData.subcubbies.find(function(s) { return s.id === entry.source.subcubbyId; });
            if (sub) {
                sub.tasks.unshift(entry.item);
            }
        }
    } else if (entry.type === 'subtask') {
        var cubbyData = appData.cubbies[entry.source.cubbyId];
        if (cubbyData) {
            cubbyData.subcubbies.forEach(function(sub) {
                var parentTask = sub.tasks.find(function(t) { return t.id === entry.source.parentTaskId; });
                if (parentTask) {
                    if (!parentTask.subtasks) parentTask.subtasks = [];
                    parentTask.subtasks.unshift(entry.item);
                }
            });
        }
    } else if (entry.type === 'subcubby') {
        var cubbyData = appData.cubbies[entry.source.cubbyId];
        if (cubbyData) {
            cubbyData.subcubbies.push(entry.item);
        }
    } else if (entry.type === 'cubby') {
        var room = appData.rooms.find(function(r) { return r.id === entry.source.roomId; });
        if (room) {
            room.cubbies.push(entry.item.ref);
            appData.cubbies[entry.item.ref.id] = entry.item.data;
        }
    }

    appData.archive.splice(archiveIndex, 1);
    saveData();
}

function permanentlyDeleteTrashItem(trashIndex) {
    appData.trash.splice(trashIndex, 1);
    saveData();
}

function emptyTrash() {
    appData.trash = [];
    saveData();
}

// ============================================
// AUTO-ARCHIVE LOGIC
// ============================================

function runAutoArchive() {
    var settings = appData.settings.autoArchive;
    if (!settings || settings.duration === 'never') return;

    var now = new Date();
    var archiveThreshold = getArchiveThresholdDate(settings, now);
    if (!archiveThreshold) return;

    var archived = false;

    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;

            cubbyData.subcubbies.forEach(function(sub) {
                var toArchive = [];

                sub.tasks.forEach(function(task) {
                    if (!task.completed || !task.completed_at) return;
                    var completedDate = new Date(task.completed_at);
                    if (completedDate <= archiveThreshold) {
                        toArchive.push(task);
                    }
                });

                toArchive.forEach(function(task) {
                    var index = sub.tasks.indexOf(task);
                    if (index !== -1) {
                        sub.tasks.splice(index, 1);
                        appData.archive.push({
                            type: 'task',
                            item: task,
                            archivedAt: now.toISOString(),
                            source: {
                                roomId: room.id, roomName: room.name,
                                cubbyId: cubbyRef.id, cubbyName: cubbyRef.name,
                                subcubbyId: sub.id, subcubbyName: sub.name,
                                parentTaskId: ''
                            }
                        });
                        archived = true;
                    }
                });

                // Also check subtasks
                sub.tasks.forEach(function(task) {
                    if (!task.subtasks) return;
                    var stToArchive = [];

                    task.subtasks.forEach(function(st) {
                        if (!st.completed || !st.completed_at) return;
                        var completedDate = new Date(st.completed_at);
                        if (completedDate <= archiveThreshold) {
                            stToArchive.push(st);
                        }
                    });

                    stToArchive.forEach(function(st) {
                        var stIndex = task.subtasks.indexOf(st);
                        if (stIndex !== -1) {
                            task.subtasks.splice(stIndex, 1);
                            appData.archive.push({
                                type: 'subtask',
                                item: st,
                                archivedAt: now.toISOString(),
                                source: {
                                    roomId: room.id, roomName: room.name,
                                    cubbyId: cubbyRef.id, cubbyName: cubbyRef.name,
                                    subcubbyId: sub.id, subcubbyName: sub.name,
                                    parentTaskId: task.id
                                }
                            });
                            archived = true;
                        }
                    });
                });
            });
        });
    });

    if (archived) saveData();
}

function getArchiveThresholdDate(settings, now) {
    if (settings.mode === 'duration') {
        var ms = 0;
        switch (settings.duration) {
            case 'immediate': return now;
            case '1day': ms = 24 * 60 * 60 * 1000; break;
            case '3days': ms = 3 * 24 * 60 * 60 * 1000; break;
            case '1week': ms = 7 * 24 * 60 * 60 * 1000; break;
            case '2weeks': ms = 14 * 24 * 60 * 60 * 1000; break;
            case '1month': ms = 30 * 24 * 60 * 60 * 1000; break;
            case 'custom': ms = (settings.customDays || 7) * 24 * 60 * 60 * 1000; break;
            case 'never': return null;
            default: ms = 7 * 24 * 60 * 60 * 1000;
        }
        return new Date(now.getTime() - ms);
    } else if (settings.mode === 'date-change') {
        // Archive tasks completed before the most recent boundary
        var threshold = new Date(now);
        switch (settings.dateChange) {
            case 'new-day':
                threshold.setHours(0, 0, 0, 0);
                break;
            case 'new-week':
                var dayOfWeek = threshold.getDay();
                var weekStart = settings.weekStart === 'monday' ? 1 : 0;
                var diff = dayOfWeek - weekStart;
                if (diff < 0) diff += 7;
                threshold.setDate(threshold.getDate() - diff);
                threshold.setHours(0, 0, 0, 0);
                break;
            case 'new-month':
                threshold.setDate(1);
                threshold.setHours(0, 0, 0, 0);
                break;
            case 'new-year':
                threshold.setMonth(0, 1);
                threshold.setHours(0, 0, 0, 0);
                break;
            default:
                threshold.setHours(0, 0, 0, 0);
        }
        return threshold;
    }
    return null;
}

function runAutoTrashPurge() {
    var settings = appData.settings.autoTrash;
    if (!settings || settings.duration === 'never') return;

    var now = new Date();
    var ms = 0;
    switch (settings.duration) {
        case '1day': ms = 24 * 60 * 60 * 1000; break;
        case '3days': ms = 3 * 24 * 60 * 60 * 1000; break;
        case '1week': ms = 7 * 24 * 60 * 60 * 1000; break;
        case '2weeks': ms = 14 * 24 * 60 * 60 * 1000; break;
        case '1month': ms = 30 * 24 * 60 * 60 * 1000; break;
        case 'custom': ms = (settings.customDays || 30) * 24 * 60 * 60 * 1000; break;
        default: ms = 30 * 24 * 60 * 60 * 1000;
    }

    var threshold = new Date(now.getTime() - ms);
    var purged = false;

    appData.trash = appData.trash.filter(function(entry) {
        var deletedDate = new Date(entry.deletedAt);
        if (deletedDate <= threshold) {
            purged = true;
            return false; // Remove
        }
        return true;
    });

    if (purged) saveData();
}
