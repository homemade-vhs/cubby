// ============================================
// drag.js - Drag & Drop Reordering System
// ============================================

// Drag state
var dragState = {
    isDragging: false,
    element: null,
    clone: null,
    container: null,
    items: [],
    type: null, // 'room', 'cubby', 'subcubby', 'task', 'subtask'
    startY: 0,
    currentY: 0,
    offsetY: 0,
    originalIndex: -1,
    currentIndex: -1,
    itemHeight: 0,
    scrollSpeed: 0,
    scrollInterval: null
};

// ============================================
// INITIALIZATION
// ============================================

function initDragAndDrop() {
    // Mouse events
    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    // Touch events
    document.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleDragStart(e) {
    // Find the draggable element
    var target = e.target;
    var draggable = findDraggableElement(target);
    
    if (!draggable || !draggable.element) return;
    
    // Don't start drag on interactive elements
    if (target.closest('.checkbox, .more-btn, .expand-btn, .subcubby-more-btn, .room-more-btn, .cubby-more-btn, button, input, textarea, a')) {
        return;
    }
    
    // Prevent default to avoid text selection
    if (e.type === 'touchstart') {
        // Allow scrolling if not on a draggable area
        // For subcubbies, only the header is draggable
        var isOnSubcubbyHeader = target.closest('.subcubby-header, .subcubby-header-left');
        var isOnTask = target.closest('.task:not(.subtask)');
        var isOnSubtask = target.closest('.task.subtask');
        var isOnRoomCard = target.closest('.room-card-main');
        var isOnCubbyCard = target.closest('.cubby-card-main');
        
        if (!isOnSubcubbyHeader && !isOnTask && !isOnSubtask && !isOnRoomCard && !isOnCubbyCard) {
            return;
        }
    }
    
    var clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    var rect = draggable.element.getBoundingClientRect();
    
    // Initialize drag state
    dragState.isDragging = false; // Will become true after threshold
    dragState.element = draggable.element;
    dragState.type = draggable.type;
    dragState.container = draggable.container;
    dragState.startY = clientY;
    dragState.currentY = clientY;
    dragState.offsetY = clientY - rect.top;
    dragState.itemHeight = rect.height;
    
    // Get all draggable siblings
    dragState.items = getDraggableItems(draggable.container, draggable.type);
    dragState.originalIndex = dragState.items.indexOf(dragState.element);
    dragState.currentIndex = dragState.originalIndex;
    
    // Add preparing class
    dragState.element.classList.add('drag-preparing');
}

function handleDragMove(e) {
    if (!dragState.element) return;
    
    var clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    var deltaY = clientY - dragState.startY;
    
    // Start dragging after 5px threshold
    if (!dragState.isDragging && Math.abs(deltaY) > 5) {
        startDragging(e);
    }
    
    if (!dragState.isDragging) return;
    
    // Prevent default scrolling on touch
    if (e.type === 'touchmove') {
        e.preventDefault();
    }
    
    dragState.currentY = clientY;
    
    // Update clone position
    updateClonePosition();
    
    // Check for reordering
    checkReorder();
    
    // Auto-scroll near edges
    handleAutoScroll(clientY);
}

function handleDragEnd(e) {
    if (!dragState.element) return;
    
    if (dragState.isDragging) {
        finishDragging();
    } else {
        // Just cleanup if we never started dragging
        dragState.element.classList.remove('drag-preparing');
    }
    
    // Clear scroll interval
    if (dragState.scrollInterval) {
        clearInterval(dragState.scrollInterval);
        dragState.scrollInterval = null;
    }
    
    // Reset state
    dragState = {
        isDragging: false,
        element: null,
        clone: null,
        container: null,
        items: [],
        type: null,
        startY: 0,
        currentY: 0,
        offsetY: 0,
        originalIndex: -1,
        currentIndex: -1,
        itemHeight: 0,
        scrollSpeed: 0,
        scrollInterval: null
    };
}

// ============================================
// DRAG OPERATIONS
// ============================================

function startDragging(e) {
    dragState.isDragging = true;
    dragState.element.classList.remove('drag-preparing');
    dragState.element.classList.add('dragging');
    
    // Prevent scrolling on mobile while dragging
    document.body.style.overflow = 'hidden';
    
    // Create clone
    var rect = dragState.element.getBoundingClientRect();
    dragState.clone = dragState.element.cloneNode(true);
    dragState.clone.classList.remove('dragging', 'drag-preparing');
    dragState.clone.classList.add('drag-clone');
    dragState.clone.style.position = 'fixed';
    dragState.clone.style.left = rect.left + 'px';
    dragState.clone.style.top = rect.top + 'px';
    dragState.clone.style.width = rect.width + 'px';
    dragState.clone.style.height = rect.height + 'px';
    dragState.clone.style.zIndex = '10000';
    dragState.clone.style.pointerEvents = 'none';
    
    // Remove onclick handlers from clone
    dragState.clone.querySelectorAll('[onclick]').forEach(function(el) {
        el.removeAttribute('onclick');
    });
    
    document.body.appendChild(dragState.clone);
    
    // Add dragging class to container
    dragState.container.classList.add('drag-active');
}

function updateClonePosition() {
    if (!dragState.clone) return;
    
    var newTop = dragState.currentY - dragState.offsetY;
    dragState.clone.style.top = newTop + 'px';
}

function checkReorder() {
    if (dragState.items.length <= 1) return;
    
    var cloneRect = dragState.clone.getBoundingClientRect();
    var cloneMiddle = cloneRect.top + cloneRect.height / 2;
    
    // Find which item the middle of the clone is over
    var newIndex = dragState.currentIndex;
    
    for (var i = 0; i < dragState.items.length; i++) {
        if (i === dragState.currentIndex) continue;
        
        var item = dragState.items[i];
        var itemRect = item.getBoundingClientRect();
        var itemMiddle = itemRect.top + itemRect.height / 2;
        
        if (i < dragState.currentIndex && cloneMiddle < itemMiddle) {
            newIndex = i;
            break;
        } else if (i > dragState.currentIndex && cloneMiddle > itemMiddle) {
            newIndex = i;
        }
    }
    
    if (newIndex !== dragState.currentIndex) {
        reorderItems(newIndex);
    }
}

function reorderItems(newIndex) {
    var oldIndex = dragState.currentIndex;
    
    // If dragging a task, we also need to move its subtasks container
    var subtasksContainer = null;
    if (dragState.type === 'task') {
        var nextSibling = dragState.element.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('subtasks-container')) {
            subtasksContainer = nextSibling;
        }
    }
    
    // Determine the target position
    var targetItem = dragState.items[newIndex];
    
    // Move the element in the DOM
    if (newIndex < oldIndex) {
        // Moving up - insert before target
        dragState.container.insertBefore(dragState.element, targetItem);
        if (subtasksContainer) {
            dragState.container.insertBefore(subtasksContainer, targetItem);
        }
    } else {
        // Moving down - insert after target (and its subtasks if it's a task)
        var insertBeforeElement = targetItem.nextElementSibling;
        
        // If target is a task with subtasks, skip past its subtasks container
        if (dragState.type === 'task' && insertBeforeElement && insertBeforeElement.classList.contains('subtasks-container')) {
            insertBeforeElement = insertBeforeElement.nextElementSibling;
        }
        
        if (insertBeforeElement) {
            dragState.container.insertBefore(dragState.element, insertBeforeElement);
            if (subtasksContainer) {
                dragState.container.insertBefore(subtasksContainer, insertBeforeElement);
            }
        } else {
            dragState.container.appendChild(dragState.element);
            if (subtasksContainer) {
                dragState.container.appendChild(subtasksContainer);
            }
        }
    }
    
    // Update items list
    dragState.items = getDraggableItems(dragState.container, dragState.type);
    dragState.currentIndex = newIndex;
}

function finishDragging() {
    // Restore body overflow
    document.body.style.overflow = '';
    
    // Remove clone
    if (dragState.clone && dragState.clone.parentNode) {
        dragState.clone.parentNode.removeChild(dragState.clone);
    }
    
    // Remove dragging classes
    dragState.element.classList.remove('dragging');
    dragState.container.classList.remove('drag-active');
    
    // Save the new order if it changed
    if (dragState.currentIndex !== dragState.originalIndex) {
        saveReorderedData();
    }
}

function handleAutoScroll(clientY) {
    var scrollThreshold = 80;
    var maxScrollSpeed = 15;
    var viewportHeight = window.innerHeight;
    
    var scrollContainer = getScrollContainer();
    if (!scrollContainer) return;
    
    if (clientY < scrollThreshold) {
        // Scroll up
        var distance = scrollThreshold - clientY;
        dragState.scrollSpeed = -Math.min(distance / 5, maxScrollSpeed);
    } else if (clientY > viewportHeight - scrollThreshold) {
        // Scroll down
        var distance = clientY - (viewportHeight - scrollThreshold);
        dragState.scrollSpeed = Math.min(distance / 5, maxScrollSpeed);
    } else {
        dragState.scrollSpeed = 0;
    }
    
    // Start/stop scroll interval
    if (dragState.scrollSpeed !== 0 && !dragState.scrollInterval) {
        dragState.scrollInterval = setInterval(function() {
            if (dragState.scrollSpeed !== 0) {
                scrollContainer.scrollTop += dragState.scrollSpeed;
                updateClonePosition();
                checkReorder();
            }
        }, 16); // ~60fps
    } else if (dragState.scrollSpeed === 0 && dragState.scrollInterval) {
        clearInterval(dragState.scrollInterval);
        dragState.scrollInterval = null;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function findDraggableElement(target) {
    // Check most specific elements first (children before parents)
    
    // Check for subtask (most specific)
    var subtask = target.closest('.task.subtask');
    if (subtask && subtask.hasAttribute('data-task-id') && subtask.classList.contains('subtask')) {
        var container = subtask.closest('.subtasks-container');
        if (container) {
            return { element: subtask, type: 'subtask', container: container };
        }
    }
    
    // Check for task (not subtask)
    var task = target.closest('.task:not(.subtask)');
    if (task && task.hasAttribute('data-task-id') && !task.classList.contains('subtask')) {
        var container = task.closest('.subcubby-tasks-inner');
        if (container) {
            return { element: task, type: 'task', container: container };
        }
    }
    
    // Check for subcubby - ONLY if clicking on the header
    if (target.closest('.subcubby-header, .subcubby-header-left')) {
        var subcubby = target.closest('.subcubby');
        if (subcubby && subcubby.hasAttribute('data-subcubby-id')) {
            var container = document.getElementById('tasks-container');
            return { element: subcubby, type: 'subcubby', container: container };
        }
    }
    
    // Check for cubby card
    var cubbyCard = target.closest('.cubby-card');
    if (cubbyCard && cubbyCard.hasAttribute('data-cubby-id')) {
        var container = document.getElementById('cubbies-list');
        return { element: cubbyCard, type: 'cubby', container: container };
    }
    
    // Check for room card
    var roomCard = target.closest('.room-card');
    if (roomCard && roomCard.hasAttribute('data-room-id')) {
        var container = document.getElementById('rooms-container');
        return { element: roomCard, type: 'room', container: container };
    }
    
    return null;
}

function getDraggableItems(container, type) {
    var selector = '';
    
    switch (type) {
        case 'room':
            selector = '.room-card[data-room-id]';
            break;
        case 'cubby':
            selector = '.cubby-card[data-cubby-id]';
            break;
        case 'subcubby':
            selector = '.subcubby[data-subcubby-id]';
            break;
        case 'task':
            selector = '.task[data-task-id]:not(.subtask)';
            break;
        case 'subtask':
            selector = '.task.subtask[data-task-id]';
            break;
    }
    
    return Array.from(container.querySelectorAll(selector));
}

function getScrollContainer() {
    switch (dragState.type) {
        case 'room':
            return document.getElementById('home-screen');
        case 'cubby':
            return document.getElementById('room-screen');
        case 'subcubby':
        case 'task':
        case 'subtask':
            return document.getElementById('cubby-screen');
        default:
            return document.documentElement;
    }
}

function saveReorderedData() {
    var type = dragState.type;
    var items = dragState.items;

    switch (type) {
        case 'room':
            var newRooms = [];
            items.forEach(function(item) {
                var roomId = item.getAttribute('data-room-id');
                var room = appData.rooms.find(function(r) { return r.id === roomId; });
                if (room) newRooms.push(room);
            });
            appData.rooms = newRooms;
            syncUpdatePositions('workspaces', buildPositionArray(appData.rooms));
            break;

        case 'cubby':
            if (currentRoom) {
                var newCubbies = [];
                items.forEach(function(item) {
                    var cubbyId = item.getAttribute('data-cubby-id');
                    var cubby = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
                    if (cubby) newCubbies.push(cubby);
                });
                currentRoom.cubbies = newCubbies;
                syncUpdatePositions('cubbies', buildPositionArray(currentRoom.cubbies));
            }
            break;

        case 'subcubby':
            if (currentCubby) {
                var cubbyData = appData.cubbies[currentCubby.id];
                var newSubcubbies = [];
                items.forEach(function(item) {
                    var subcubbyId = item.getAttribute('data-subcubby-id');
                    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
                    if (subcubby) newSubcubbies.push(subcubby);
                });
                cubbyData.subcubbies = newSubcubbies;
                syncUpdatePositions('subcubbies', buildPositionArray(cubbyData.subcubbies));
            }
            break;

        case 'task':
            if (currentCubby) {
                var cubbyData = appData.cubbies[currentCubby.id];
                var firstTaskEl = items[0];
                var subcubbyEl = firstTaskEl.closest('.subcubby');
                if (subcubbyEl) {
                    var subcubbyId = subcubbyEl.getAttribute('data-subcubby-id');
                    var subcubby = cubbyData.subcubbies.find(function(s) { return s.id === subcubbyId; });
                    if (subcubby) {
                        var newTasks = [];
                        items.forEach(function(item) {
                            var taskId = item.getAttribute('data-task-id');
                            var task = subcubby.tasks.find(function(t) { return t.id === taskId; });
                            if (task) newTasks.push(task);
                        });
                        subcubby.tasks = newTasks;
                        syncUpdatePositions('tasks', buildPositionArray(subcubby.tasks));
                    }
                }
            }
            break;

        case 'subtask':
            if (currentCubby) {
                var cubbyData = appData.cubbies[currentCubby.id];
                var firstSubtaskEl = items[0];
                var subtasksContainer = firstSubtaskEl.closest('.subtasks-container');
                if (subtasksContainer) {
                    var parentTaskId = subtasksContainer.getAttribute('data-parent-task');
                    var parentTask = null;
                    cubbyData.subcubbies.forEach(function(sub) {
                        var found = sub.tasks.find(function(t) { return t.id === parentTaskId; });
                        if (found) parentTask = found;
                    });

                    if (parentTask && parentTask.subtasks) {
                        var newSubtasks = [];
                        items.forEach(function(item) {
                            var subtaskId = item.getAttribute('data-task-id');
                            var subtask = parentTask.subtasks.find(function(st) { return st.id === subtaskId; });
                            if (subtask) newSubtasks.push(subtask);
                        });
                        parentTask.subtasks = newSubtasks;
                        syncUpdatePositions('subtasks', buildPositionArray(parentTask.subtasks));
                    }
                }
            }
            break;
    }

    saveData();
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Initialize drag and drop when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDragAndDrop);
} else {
    // DOM is already loaded
    initDragAndDrop();
}
