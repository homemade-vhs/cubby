// ============================================
// app.js - Core Application Data & State
// ============================================

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

var colorThemes = {
    purple: { bg: '#9b87f5', card: 'rgba(155, 135, 245, 0.15)', border: 'rgba(155, 135, 245, 0.3)', text: '#9b87f5', textMuted: 'rgba(155, 135, 245, 0.6)' },
    blue: { bg: '#0ea5e9', card: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.3)', text: '#0ea5e9', textMuted: 'rgba(14, 165, 233, 0.6)' },
    green: { bg: '#22c55e', card: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e', textMuted: 'rgba(34, 197, 94, 0.6)' },
    orange: { bg: '#f97316', card: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316', textMuted: 'rgba(249, 115, 22, 0.6)' },
    pink: { bg: '#ec4899', card: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', text: '#ec4899', textMuted: 'rgba(236, 72, 153, 0.6)' },
    red: { bg: '#ef4444', card: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444', textMuted: 'rgba(239, 68, 68, 0.6)' },
    yellow: { bg: '#eab308', card: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.3)', text: '#eab308', textMuted: 'rgba(234, 179, 8, 0.6)' },
    teal: { bg: '#14b8a6', card: 'rgba(20, 184, 166, 0.15)', border: 'rgba(20, 184, 166, 0.3)', text: '#14b8a6', textMuted: 'rgba(20, 184, 166, 0.6)' }
};

// Tag colors (8 colors for tags)
var tagColors = {
    blue: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.4)' },
    green: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.4)' },
    purple: { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.4)' },
    orange: { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316', border: 'rgba(249, 115, 22, 0.4)' },
    pink: { bg: 'rgba(236, 72, 153, 0.2)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.4)' },
    red: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' },
    yellow: { bg: 'rgba(234, 179, 8, 0.2)', text: '#eab308', border: 'rgba(234, 179, 8, 0.4)' },
    gray: { bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.4)' }
};

var tagColorNames = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'yellow', 'gray'];

// ============================================
// APPLICATION DATA
// ============================================

var appData = {
    rooms: [],
    cubbies: {}
};

// ============================================
// NAVIGATION STATE
// ============================================

var currentView = 'home';
var currentRoom = null;
var currentCubby = null;

// ============================================
// LOCALSTORAGE FUNCTIONS
// ============================================

function loadData() {
    var stored = localStorage.getItem('cubby_data');
    if (stored) {
        try {
            appData = JSON.parse(stored);
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
            name: 'My Room',
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
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('room-screen').classList.add('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderRoom(currentRoom);
}

function selectCubby(cubbyId) {
    currentCubby = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!currentCubby) return;
    currentView = 'cubby';
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.add('active');
    renderCubby(currentCubby);
}

function goToHome() {
    currentView = 'home';
    currentRoom = null;
    currentCubby = null;
    document.getElementById('home-screen').classList.add('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderHome();
}

function goToRoom() {
    if (!currentRoom) return goToHome();
    currentView = 'room';
    currentCubby = null;
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('room-screen').classList.add('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderRoom(currentRoom);
}

// ============================================
// THEME FUNCTIONS
// ============================================

function setCubbyTheme(colorName) {
    var theme = colorThemes[colorName] || colorThemes.purple;
    var root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-card', theme.card);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-muted', theme.textMuted);
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
    } else {
        var options = { month: 'short', day: 'numeric' };
        text = dueDate.toLocaleDateString('en-US', options);
        className = 'future';
    }
    
    return { text: text, class: className };
}

// ============================================
// INITIALIZATION
// ============================================

// Load data on page load
loadData();
