// ============================================
// animations.js - FLIP Animations
// ============================================

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
