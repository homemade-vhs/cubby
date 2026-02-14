// ============================================
// app.js - Core Application Data & State
// ============================================

// Remove animate-in classes after entrance animations finish
// so they don't interfere with click animations (clickPop)
document.addEventListener('animationend', function(e) {
    if (e.target.classList.contains('animate-in')) {
        e.target.classList.remove('animate-in');
        e.target.classList.remove('delay-1', 'delay-2', 'delay-3');
        e.target.style.opacity = '';
    }
});

// Sound stubs (removed functionality, keeping placeholders for compatibility)
var soundCheck, soundUncheck, soundSubcubbyExpand, soundSubcubbyCollapse, soundSubtaskExpand, soundSubtaskCollapse;

function playCheckSound() {}
function playUncheckSound() {}
function playSubcubbyExpandSound() {}
function playSubcubbyCollapseSound() {}
function playSubtaskExpandSound() {}
function playSubtaskCollapseSound() {}

// ============================================
// COLOR THEMES
// ============================================

// ============================================
// ICON LIBRARY
// ============================================

var iconLibrary = {
    // Home & Living
    'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'bed': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
    'sofa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>',
    'bath': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/><path d="M4 21l1-1.5"/><path d="M20 21l-1-1.5"/></svg>',
    'kitchen': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',

    // Work & Productivity
    'briefcase': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'laptop': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>',
    'monitor': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    'phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    'mail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    'clipboard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',

    // Education & Learning
    'book': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    'bookmark': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    'graduation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    'pencil': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',

    // Health & Fitness
    'heart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'activity': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'dumbbell': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 20V4"/><path d="M18 20V4"/><path d="M4 18V6"/><path d="M20 18V6"/><path d="M2 16V8"/><path d="M22 16V8"/></svg>',

    // Creative & Hobbies
    'music': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    'camera': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    'palette': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    'film': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>',
    'gamepad': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>',

    // Finance & Shopping
    'wallet': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M16 12h.01"/><path d="M2 10h20"/></svg>',
    'cart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    'tag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    'gift': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',

    // Travel & Transport
    'plane': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
    'car': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10.1-4.35l1.34.67a2 2 0 0 1 1.06 1.76V18a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H8.5a2 2 0 0 1-4 0h-1a1 1 0 0 1-1-1v-3.92a2 2 0 0 1 1.06-1.76l1.34-.67A8 8 0 0 1 12 8a8 8 0 0 1 7.1 3.65z"/></svg>',
    'map': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    'globe': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',

    // Nature & Weather
    'sun': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    'moon': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    'tree': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-7"/><path d="M9 22h6"/><path d="M12 3l-7 12h14z"/></svg>',
    'flower': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-8"/><circle cx="12" cy="8" r="3"/><circle cx="12" cy="5" r="3"/><circle cx="9.27" cy="6.73" r="3"/><circle cx="14.73" cy="6.73" r="3"/><circle cx="9.27" cy="9.27" r="3"/><circle cx="14.73" cy="9.27" r="3"/></svg>',
    'paw': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M11 14c-1.333-2-4-4-6-4 0 4 2.667 8 6 10 3.333-2 6-6 6-10-2 0-4.667 2-6 4z"/></svg>',

    // Social & People
    'user': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'baby': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h0.01"/><path d="M15 12h0.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><circle cx="12" cy="12" r="10"/><path d="M8 2c2 1 3.5 3.5 3.5 3.5S10 7 8 8"/></svg>',

    // Misc & Utility
    'star': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'bolt': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'flag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    'target': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'bulb': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    'wrench': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    'coffee': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    'box': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    'archive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
    'folder': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    'lock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    'key': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    'compass': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    'clock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
};

function getIconSvg(iconName) {
    return iconLibrary[iconName] || '';
}

var iconNames = Object.keys(iconLibrary);

var colorThemes = {
    blue: { primary: '#6BA3FF', bg: '#0a1628', card: 'rgba(107, 163, 255, 0.15)', cardHover: 'rgba(107, 163, 255, 0.25)', border: 'rgba(107, 163, 255, 0.45)', text: '#c5dfff', textMuted: 'rgba(107, 163, 255, 0.7)', glow: 'rgba(107, 163, 255, 0.5)' },
    purple: { primary: '#C77DFF', bg: '#180a28', card: 'rgba(199, 125, 255, 0.15)', cardHover: 'rgba(199, 125, 255, 0.25)', border: 'rgba(199, 125, 255, 0.45)', text: '#e8c8ff', textMuted: 'rgba(199, 125, 255, 0.7)', glow: 'rgba(199, 125, 255, 0.5)' },
    pink: { primary: '#FF6BAD', bg: '#280a18', card: 'rgba(255, 107, 173, 0.15)', cardHover: 'rgba(255, 107, 173, 0.25)', border: 'rgba(255, 107, 173, 0.45)', text: '#ffc8e0', textMuted: 'rgba(255, 107, 173, 0.7)', glow: 'rgba(255, 107, 173, 0.5)' },
    red: { primary: '#FF6B6B', bg: '#280a0a', card: 'rgba(255, 107, 107, 0.15)', cardHover: 'rgba(255, 107, 107, 0.25)', border: 'rgba(255, 107, 107, 0.45)', text: '#ffc8c8', textMuted: 'rgba(255, 107, 107, 0.7)', glow: 'rgba(255, 107, 107, 0.5)' },
    orange: { primary: '#FFB05A', bg: '#281808', card: 'rgba(255, 176, 90, 0.15)', cardHover: 'rgba(255, 176, 90, 0.25)', border: 'rgba(255, 176, 90, 0.45)', text: '#ffe0c0', textMuted: 'rgba(255, 176, 90, 0.7)', glow: 'rgba(255, 176, 90, 0.5)' },
    yellow: { primary: '#FFE85A', bg: '#282408', card: 'rgba(255, 232, 90, 0.15)', cardHover: 'rgba(255, 232, 90, 0.25)', border: 'rgba(255, 232, 90, 0.45)', text: '#fff8c0', textMuted: 'rgba(255, 232, 90, 0.7)', glow: 'rgba(255, 232, 90, 0.5)' },
    green: { primary: '#6BF5A0', bg: '#082818', card: 'rgba(107, 245, 160, 0.15)', cardHover: 'rgba(107, 245, 160, 0.25)', border: 'rgba(107, 245, 160, 0.45)', text: '#c0ffe0', textMuted: 'rgba(107, 245, 160, 0.7)', glow: 'rgba(107, 245, 160, 0.5)' },
    teal: { primary: '#5AF0E0', bg: '#082824', card: 'rgba(90, 240, 224, 0.15)', cardHover: 'rgba(90, 240, 224, 0.25)', border: 'rgba(90, 240, 224, 0.45)', text: '#c0fff8', textMuted: 'rgba(90, 240, 224, 0.7)', glow: 'rgba(90, 240, 224, 0.5)' }
};

// Store defaults for reset
var defaultColorThemes = JSON.parse(JSON.stringify(colorThemes));

// Generate a full color theme from a single hex color
function generateThemeFromHex(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    // bg: very dark tinted version
    var bgR = Math.round(r * 0.04 + 4);
    var bgG = Math.round(g * 0.04 + 4);
    var bgB = Math.round(b * 0.04 + 4);
    var bgHex = '#' + bgR.toString(16).padStart(2, '0') + bgG.toString(16).padStart(2, '0') + bgB.toString(16).padStart(2, '0');
    // text: light tinted version (mix with white at ~75%)
    var tR = Math.min(255, Math.round(r * 0.3 + 180));
    var tG = Math.min(255, Math.round(g * 0.3 + 180));
    var tB = Math.min(255, Math.round(b * 0.3 + 180));
    var textHex = '#' + tR.toString(16).padStart(2, '0') + tG.toString(16).padStart(2, '0') + tB.toString(16).padStart(2, '0');
    return {
        primary: hex,
        bg: bgHex,
        card: 'rgba(' + r + ', ' + g + ', ' + b + ', 0.15)',
        cardHover: 'rgba(' + r + ', ' + g + ', ' + b + ', 0.25)',
        border: 'rgba(' + r + ', ' + g + ', ' + b + ', 0.45)',
        text: textHex,
        textMuted: 'rgba(' + r + ', ' + g + ', ' + b + ', 0.7)',
        glow: 'rgba(' + r + ', ' + g + ', ' + b + ', 0.5)'
    };
}

// Apply custom colors from settings
function applyCustomColors() {
    if (appData.settings && appData.settings.customColors) {
        var custom = appData.settings.customColors;
        Object.keys(custom).forEach(function(name) {
            if (colorThemes[name]) {
                colorThemes[name] = generateThemeFromHex(custom[name]);
            }
        });
    }
}

// Tag colors for task tags
var tagColors = {
    red: { bg: 'rgba(255, 107, 107, 0.3)', text: '#ff6b6b' },
    orange: { bg: 'rgba(255, 176, 90, 0.3)', text: '#ffb05a' },
    yellow: { bg: 'rgba(255, 232, 90, 0.3)', text: '#ffe85a' },
    green: { bg: 'rgba(107, 245, 160, 0.3)', text: '#6bf5a0' },
    blue: { bg: 'rgba(107, 163, 255, 0.3)', text: '#6ba3ff' },
    purple: { bg: 'rgba(199, 125, 255, 0.3)', text: '#c77dff' },
    pink: { bg: 'rgba(255, 107, 173, 0.3)', text: '#ff6bad' },
    gray: { bg: 'rgba(255, 255, 255, 0.18)', text: 'rgba(255, 255, 255, 0.75)' }
};

var tagColorNames = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'];

// ============================================
// APPLICATION DATA
// ============================================

var appData = {
    rooms: [],
    cubbies: {},
    archive: [],
    trash: [],
    settings: {
        userName: '',
        autoArchive: {
            mode: 'duration',
            duration: '1week',
            customDays: 7,
            dateChange: 'new-week',
            weekStart: 'monday'
        },
        autoTrash: {
            mode: 'duration',
            duration: '1month',
            customDays: 30,
            dateChange: 'new-week',
            weekStart: 'monday'
        },
        homeLayout: [
            { id: 'stats', visible: true, label: 'Quick Stats' },
            { id: 'upcoming', visible: true, label: 'Upcoming Tasks' },
            { id: 'quick-actions', visible: true, label: 'Quick Actions' },
            { id: 'workspaces', visible: true, label: 'Workspaces' }
        ]
    }
};

// ============================================
// NAVIGATION STATE
// ============================================

var currentView = 'home';
var currentRoom = null;
var currentCubby = null;
var cubbyDateColorMode = false; // When true, tasks in cubby use due-date-based colors
var homeEditMode = false; // When true, home is in edit/customize mode

// ============================================
// LOCALSTORAGE FUNCTIONS
// ============================================

function loadData() {
    var stored = localStorage.getItem('cubby_data');
    if (stored) {
        try {
            appData = JSON.parse(stored);
            // Migrate: ensure archive, trash, and settings exist
            if (!appData.archive) appData.archive = [];
            if (!appData.trash) appData.trash = [];
            if (!appData.settings) {
                appData.settings = {};
            }
            if (!appData.settings.autoArchive) {
                appData.settings.autoArchive = {
                    mode: 'duration',
                    duration: '1week',
                    customDays: 7,
                    dateChange: 'new-week',
                    weekStart: 'monday'
                };
            }
            if (!appData.settings.autoTrash) {
                appData.settings.autoTrash = {
                    mode: 'duration',
                    duration: '1month',
                    customDays: 30,
                    dateChange: 'new-week',
                    weekStart: 'monday'
                };
            }
            if (!appData.settings.autoTrash.mode) {
                appData.settings.autoTrash.mode = 'duration';
                appData.settings.autoTrash.dateChange = appData.settings.autoTrash.dateChange || 'new-week';
                appData.settings.autoTrash.weekStart = appData.settings.autoTrash.weekStart || 'monday';
            }
            if (appData.settings.userName === undefined) {
                appData.settings.userName = '';
            }
            if (!appData.settings.homeLayout) {
                appData.settings.homeLayout = [
                    { id: 'stats', visible: true, label: 'Quick Stats' },
                    { id: 'upcoming', visible: true, label: 'Upcoming Tasks' },
                    { id: 'quick-actions', visible: true, label: 'Quick Actions' },
                    { id: 'workspaces', visible: true, label: 'Workspaces' }
                ];
                // Save the migrated data immediately
                saveData();
            }
        } catch (e) {
            console.error('Error loading data:', e);
            initializeDefaultData();
        }
    } else {
        initializeDefaultData();
    }
}

function saveData() {
    localStorage.setItem('cubby_data', JSON.stringify(appData));
}

function initializeDefaultData() {
    appData = {
        rooms: [{
            id: 'room1',
            name: 'My Workspace',
            cubbies: [{
                id: 'cubby1',
                name: 'Tasks',
                color: 'purple'
            }]
        }],
        cubbies: {
            'cubby1': {
                subcubbies: [{
                    id: 'sub1',
                    name: 'General',
                    expanded: true,
                    tasks: []
                }]
            }
        },
        archive: [],
        trash: [],
        settings: {
            userName: '',
            autoArchive: {
                mode: 'duration',
                duration: '1week',
                customDays: 7,
                dateChange: 'new-week',
                weekStart: 'monday'
            },
            autoTrash: {
                mode: 'duration',
                duration: '1month',
                customDays: 30,
                dateChange: 'new-week',
                weekStart: 'monday'
            },
            homeLayout: [
                { id: 'stats', visible: true, label: 'Quick Stats' },
                { id: 'upcoming', visible: true, label: 'Upcoming Tasks' },
                { id: 'quick-actions', visible: true, label: 'Quick Actions' },
                { id: 'workspaces', visible: true, label: 'Workspaces' }
            ]
        }
    };
    saveData();
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function selectRoom(roomId) {
    currentRoom = appData.rooms.find(function(r) { return r.id === roomId; });
    if (!currentRoom) return;
    currentView = 'room';
    hideAllScreens();
    document.getElementById('room-screen').classList.add('active');
    renderRoom(currentRoom);
    updateNavBar();
}

function selectCubby(cubbyId) {
    currentCubby = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!currentCubby) return;
    currentView = 'cubby';
    hideAllScreens();
    document.getElementById('cubby-screen').classList.add('active');
    renderCubby(currentCubby);
    updateNavBar();
}

function goToHome() {
    currentView = 'home';
    currentRoom = null;
    currentCubby = null;
    hideAllScreens();
    document.getElementById('home-screen').classList.add('active');
    renderHome();
    updateNavBar();
}

function goToRoom() {
    if (!currentRoom) return goToHome();
    currentView = 'room';
    currentCubby = null;
    hideAllScreens();
    document.getElementById('room-screen').classList.add('active');
    renderRoom(currentRoom);
    updateNavBar();
}

function openViews() {
    currentView = 'views';
    currentRoom = null;
    currentCubby = null;
    hideAllScreens();
    document.getElementById('views-screen').classList.add('active');
    renderViews();
    updateNavBar();
}

function openCubbiesBrowse() {
    currentView = 'cubbies';
    currentRoom = null;
    currentCubby = null;
    hideAllScreens();
    document.getElementById('cubbies-screen').classList.add('active');
    renderCubbiesBrowse();
    updateNavBar();
}

function hideAllScreens() {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('views-screen').classList.remove('active');
    document.getElementById('cubbies-screen').classList.remove('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.remove('active');
    document.getElementById('settings-screen').classList.remove('active');
    document.getElementById('archive-screen').classList.remove('active');
    document.getElementById('trash-screen').classList.remove('active');
}

function openSettings() {
    currentView = 'settings';
    currentRoom = null;
    currentCubby = null;
    hideAllScreens();
    document.getElementById('settings-screen').classList.add('active');
    renderSettings();
    updateNavBar();
}

function openArchive() {
    currentView = 'archive';
    hideAllScreens();
    document.getElementById('archive-screen').classList.add('active');
    renderArchive();
    updateNavBar();
}

function openTrash() {
    currentView = 'trash';
    hideAllScreens();
    document.getElementById('trash-screen').classList.add('active');
    renderTrash();
    updateNavBar();
}

// ============================================
// THEME FUNCTIONS
// ============================================

function setCubbyTheme(colorName) {
    var theme = colorThemes[colorName] || colorThemes.purple;
    var root = document.getElementById('cubby-screen');
    root.style.background = theme.bg;
    root.style.setProperty('--cubby-primary', theme.primary);
    root.style.setProperty('--cubby-card', theme.card);
    root.style.setProperty('--cubby-card-hover', theme.cardHover);
    root.style.setProperty('--cubby-border', theme.border);
    root.style.setProperty('--cubby-text', theme.text);
    root.style.setProperty('--cubby-text-muted', theme.textMuted);
    root.style.setProperty('--cubby-glow', theme.glow);
}

function toggleCubbyDateColorMode() {
    cubbyDateColorMode = !cubbyDateColorMode;
    var toggle = document.getElementById('cubby-date-toggle');
    if (toggle) {
        toggle.classList.toggle('active', cubbyDateColorMode);
    }
    if (cubbyDateColorMode) {
        // Switch to greyscale background
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
        // Restore cubby theme
        if (currentCubby) setCubbyTheme(currentCubby.color || 'purple');
    }
    if (currentCubby) renderCubby(currentCubby);
}

// ============================================
// NAVIGATION BAR
// ============================================

function updateNavBar() {
    // Close search modal if open
    if (typeof closeSearchModal === 'function' && typeof searchOpen !== 'undefined' && searchOpen) {
        closeSearchModal();
    }
    // Clear search tab highlight
    var searchTab = document.querySelector('.nav-tab-search');
    if (searchTab) searchTab.classList.remove('active');

    var tabs = document.querySelectorAll('.nav-tab[data-tab]');
    tabs.forEach(function(tab) {
        var tabName = tab.dataset.tab;
        var isActive = false;
        if (tabName === 'cubbies') {
            isActive = currentView === 'cubbies' || currentView === 'room' || currentView === 'cubby';
        } else if (tabName === 'home') {
            isActive = currentView === 'home';
        } else if (tabName === 'profile') {
            isActive = currentView === 'settings' || currentView === 'archive' || currentView === 'trash';
        } else {
            isActive = tabName === currentView;
        }
        if (isActive) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Also update the sidebar
    if (typeof updateSidebar === 'function') {
        updateSidebar();
    }
}

function showNavBar() {
    var nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'flex';
    // Show sidebar on desktop
    var sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.style.display = 'flex';
}

function hideNavBar() {
    var nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'none';
    // Hide sidebar (auth screen, etc.)
    var sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.style.display = 'none';
}

function updateNavUserName(name) {
    // Update sidebar user info
    if (typeof updateSidebarUserInfo === 'function') {
        updateSidebarUserInfo();
    }
}

function openProfileMenu() {
    openSettings();
}

// ============================================
// SIDEBAR
// ============================================

var mobileSidebarOpen = false;
var sidebarExpandedWorkspaces = {}; // Track which workspaces are expanded in sidebar

function toggleMobileSidebar() {
    if (mobileSidebarOpen) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

function openMobileSidebar() {
    mobileSidebarOpen = true;
    var sidebar = document.getElementById('app-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    renderSidebarWorkspaces();
}

function closeMobileSidebar() {
    mobileSidebarOpen = false;
    var sidebar = document.getElementById('app-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

function renderSidebarWorkspaces() {
    var container = document.getElementById('sidebar-workspaces');
    if (!container) return;

    var html = '';
    appData.rooms.forEach(function(room) {
        var roomColor = room.color;
        var roomTheme = roomColor ? (colorThemes[roomColor] || colorThemes.purple) : null;
        var dotColor = roomTheme ? roomTheme.primary : 'rgba(255,255,255,0.3)';
        var nameColor = roomTheme ? roomTheme.text : 'rgba(255,255,255,0.6)';
        var isExpanded = sidebarExpandedWorkspaces[room.id] !== false; // default expanded
        var isActiveRoom = currentRoom && currentRoom.id === room.id;
        var activeClass = (isActiveRoom && currentView === 'room') ? ' active' : '';

        html += '<div class="sidebar-workspace-item' + activeClass + '" onclick="sidebarToggleWorkspace(\'' + room.id + '\')" oncontextmenu="event.preventDefault(); sidebarSelectRoom(\'' + room.id + '\')">';
        html += '<div class="sidebar-workspace-chevron' + (isExpanded ? ' expanded' : '') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6L15 12L9 18"/></svg></div>';
        html += '<div class="sidebar-workspace-dot" style="background:' + dotColor + '"></div>';
        html += '<span class="sidebar-workspace-name" style="color:' + nameColor + '">' + room.name + '</span>';
        html += '<span class="sidebar-workspace-count">' + room.cubbies.length + '</span>';
        html += '</div>';

        // Cubbies list (collapsible)
        html += '<div class="sidebar-cubbies-list' + (isExpanded ? ' expanded' : '') + '" data-workspace-id="' + room.id + '">';
        room.cubbies.forEach(function(cubby) {
            var cubbyTheme = colorThemes[cubby.color] || colorThemes.purple;
            var isActiveCubby = currentCubby && currentCubby.id === cubby.id;
            var cubbyActiveClass = isActiveCubby ? ' active' : '';
            html += '<div class="sidebar-cubby-item' + cubbyActiveClass + '" onclick="sidebarSelectCubby(\'' + room.id + '\', \'' + cubby.id + '\')">';
            html += '<div class="sidebar-cubby-dot" style="background:' + cubbyTheme.primary + '"></div>';
            html += '<span class="sidebar-cubby-name">' + cubby.name + '</span>';
            html += '</div>';
        });
        html += '</div>';
    });

    container.innerHTML = html;
}

function sidebarToggleWorkspace(roomId) {
    if (sidebarExpandedWorkspaces[roomId] === undefined) {
        sidebarExpandedWorkspaces[roomId] = false; // collapse (default is expanded)
    } else {
        sidebarExpandedWorkspaces[roomId] = !sidebarExpandedWorkspaces[roomId];
    }
    renderSidebarWorkspaces();
}

function sidebarSelectRoom(roomId) {
    closeMobileSidebar();
    selectRoom(roomId);
}

function sidebarSelectCubby(roomId, cubbyId) {
    closeMobileSidebar();
    currentRoom = appData.rooms.find(function(r) { return r.id === roomId; });
    if (!currentRoom) return;
    // Make sure that workspace is expanded in sidebar
    sidebarExpandedWorkspaces[roomId] = true;
    selectCubby(cubbyId);
}

function updateSidebar() {
    // Update active states on sidebar nav items
    var items = document.querySelectorAll('.sidebar-nav-item[data-sidebar-tab]');
    items.forEach(function(item) {
        var tab = item.dataset.sidebarTab;
        var isActive = false;
        if (tab === 'home') {
            isActive = currentView === 'home';
        } else if (tab === 'views') {
            isActive = currentView === 'views';
        } else if (tab === 'cubbies') {
            isActive = currentView === 'cubbies' || currentView === 'room' || currentView === 'cubby';
        } else if (tab === 'profile') {
            isActive = currentView === 'settings' || currentView === 'archive' || currentView === 'trash';
        }
        if (isActive) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Render workspaces in sidebar
    renderSidebarWorkspaces();

    // Update user info in sidebar
    updateSidebarUserInfo();
}

function updateSidebarUserInfo() {
    var nameEl = document.getElementById('sidebar-user-name');
    var avatarEl = document.getElementById('sidebar-user-avatar');
    if (!nameEl || !avatarEl) return;

    var name = '';
    if (appData.settings && appData.settings.userName) {
        name = appData.settings.userName;
    }

    if (name) {
        nameEl.textContent = name;
        avatarEl.textContent = name.charAt(0).toUpperCase();
    } else {
        nameEl.textContent = 'user';
        avatarEl.textContent = '?';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDueDate(dateString) {
    if (!dateString) return { text: '', class: '' };
    
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    
    var dueDate = new Date(dateString + 'T00:00:00');
    var diffTime = dueDate - today;
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    var text = '';
    var className = '';
    
    if (diffDays < 0) {
        text = 'Overdue';
        className = 'overdue';
    } else if (diffDays === 0) {
        text = 'Today';
        className = 'today';
    } else if (diffDays === 1) {
        text = 'Tomorrow';
        className = 'tomorrow';
    } else if (diffDays <= 7) {
        text = diffDays + ' days';
        className = 'upcoming';
    } else if (diffDays <= 14) {
        text = diffDays + ' days';
        className = 'next-week';
    } else {
        var options = { month: 'short', day: 'numeric' };
        text = dueDate.toLocaleDateString('en-US', options);
        className = 'future';
    }
    
    return { text: text, class: className };
}

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

// Due-date-based color themes
var dueDateColorThemes = {
    'overdue':   { primary: '#ff6b6b', bg: '#0a0a0f', card: 'rgba(255,107,107,0.08)', cardHover: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.2)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', glow: 'rgba(255,107,107,0.4)' },
    'today':     { primary: '#feca57', bg: '#0a0a0f', card: 'rgba(254,202,87,0.06)', cardHover: 'rgba(254,202,87,0.1)', border: 'rgba(254,202,87,0.18)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', glow: 'rgba(254,202,87,0.3)' },
    'tomorrow':  { primary: '#2ed573', bg: '#0a0a0f', card: 'rgba(46,213,115,0.06)', cardHover: 'rgba(46,213,115,0.1)', border: 'rgba(46,213,115,0.18)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', glow: 'rgba(46,213,115,0.3)' },
    'this-week': { primary: '#5B8EFF', bg: '#0a0a0f', card: 'rgba(91,142,255,0.06)', cardHover: 'rgba(91,142,255,0.1)', border: 'rgba(91,142,255,0.18)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', glow: 'rgba(91,142,255,0.3)' },
    'next-week': { primary: '#a55eea', bg: '#0a0a0f', card: 'rgba(165,94,234,0.06)', cardHover: 'rgba(165,94,234,0.1)', border: 'rgba(165,94,234,0.18)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', glow: 'rgba(165,94,234,0.3)' },
    'later':     { primary: '#ffffff', bg: '#0a0a0f', card: 'rgba(255,255,255,0.05)', cardHover: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.12)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', glow: 'rgba(255,255,255,0.1)' },
    'no-date':   { primary: 'rgba(255,255,255,0.3)', bg: '#0a0a0f', card: 'rgba(255,255,255,0.03)', cardHover: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.08)', text: '#ffffff', textMuted: 'rgba(255,255,255,0.35)', glow: 'rgba(255,255,255,0.05)' }
};

// ============================================
// HOME LAYOUT CUSTOMIZATION
// ============================================

function toggleHomeEditMode() {
    homeEditMode = !homeEditMode;
    renderHome(true);
}

function toggleHomeSection(sectionId) {
    var section = appData.settings.homeLayout.find(function(s) { return s.id === sectionId; });
    if (section) {
        section.visible = !section.visible;
        saveData();
        renderHome(true);
    }
}

function moveHomeSectionUp(sectionId) {
    var index = appData.settings.homeLayout.findIndex(function(s) { return s.id === sectionId; });
    if (index > 0) {
        var container = document.getElementById('home-sections-container');
        animateHomeSectionMove(container, function() {
            var temp = appData.settings.homeLayout[index];
            appData.settings.homeLayout[index] = appData.settings.homeLayout[index - 1];
            appData.settings.homeLayout[index - 1] = temp;
            saveData();
            renderHome(true);
        });
    }
}

function moveHomeSectionDown(sectionId) {
    var index = appData.settings.homeLayout.findIndex(function(s) { return s.id === sectionId; });
    if (index >= 0 && index < appData.settings.homeLayout.length - 1) {
        var container = document.getElementById('home-sections-container');
        animateHomeSectionMove(container, function() {
            var temp = appData.settings.homeLayout[index];
            appData.settings.homeLayout[index] = appData.settings.homeLayout[index + 1];
            appData.settings.homeLayout[index + 1] = temp;
            saveData();
            renderHome(true);
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Load data on page load
loadData();
applyCustomColors();
