// ============================================
// animations.js - FLIP Animations
// ============================================

// ============================================
// ANIMATE HOME SECTIONS
// ============================================

function animateHomeSectionMove(container, callback) {
    if (!container) {
        callback();
        return;
    }

    // First: Get initial positions
    var wrappers = Array.from(container.children);
    var firstPositions = wrappers.map(function(el) {
        return el.getBoundingClientRect();
    });

    // Last: Execute the DOM change
    callback();

    // Get final positions
    var lastPositions = wrappers.map(function(el) {
        return el.getBoundingClientRect();
    });

    // Invert: Calculate difference and apply transform
    wrappers.forEach(function(el, index) {
        var deltaY = firstPositions[index].top - lastPositions[index].top;
        if (Math.abs(deltaY) > 1) {
            el.style.transform = 'translateY(' + deltaY + 'px)';
            el.style.transition = 'none';
        }
    });

    // Play: Force reflow then animate to final position
    container.offsetHeight;
    wrappers.forEach(function(el) {
        el.style.transform = '';
        el.style.transition = '';
    });
}

// ============================================
// ANIMATE ELEMENTS (Tasks)
// ============================================

function animateElements(container, oldPositions) {
    var elements = Array.from(container.children);
    elements.forEach(function(el) {
        var oldPos = oldPositions.get(el);
        if (!oldPos) return;
        
        var newPos = el.getBoundingClientRect();
        var deltaY = oldPos.top - newPos.top;
        
        if (Math.abs(deltaY) > 1) {
            el.style.transform = 'translateY(' + deltaY + 'px)';
            el.style.transition = 'none';
            
            // Force reflow
            el.offsetHeight;
            
            el.style.transition = 'transform 0.3s ease';
            el.style.transform = '';
            
            // Cleanup after animation
            setTimeout(function() {
                el.style.transition = '';
            }, 300);
        }
    });
}

// ============================================
// ANIMATE SUBTASKS
// ============================================

function animateSubtasks(container, oldPositions) {
    var elements = Array.from(container.querySelectorAll('.subtask'));
    elements.forEach(function(el) {
        var oldPos = oldPositions.get(el);
        if (!oldPos) return;
        
        var newPos = el.getBoundingClientRect();
        var deltaY = oldPos.top - newPos.top;
        
        if (Math.abs(deltaY) > 1) {
            el.style.transform = 'translateY(' + deltaY + 'px)';
            el.style.transition = 'none';
            
            // Force reflow
            el.offsetHeight;
            
            el.style.transition = 'transform 0.3s ease';
            el.style.transform = '';
            
            // Cleanup after animation
            setTimeout(function() {
                el.style.transition = '';
            }, 300);
        }
    });
}
