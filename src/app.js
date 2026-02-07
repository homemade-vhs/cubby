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
    blue: { primary: '#6BA3FF', bg: '#0a1628', card: 'rgba(107, 163, 255, 0.15)', cardHover: 'rgba(107, 163, 255, 0.25)', border: 'rgba(107, 163, 255, 0.45)', text: '#c5dfff', textMuted: 'rgba(107, 163, 255, 0.7)', glow: 'rgba(107, 163, 255, 0.5)' },
    purple: { primary: '#C77DFF', bg: '#180a28', card: 'rgba(199, 125, 255, 0.15)', cardHover: 'rgba(199, 125, 255, 0.25)', border: 'rgba(199, 125, 255, 0.45)', text: '#e8c8ff', textMuted: 'rgba(199, 125, 255, 0.7)', glow: 'rgba(199, 125, 255, 0.5)' },
    pink: { primary: '#FF6BAD', bg: '#280a18', card: 'rgba(255, 107, 173, 0.15)', cardHover: 'rgba(255, 107, 173, 0.25)', border: 'rgba(255, 107, 173, 0.45)', text: '#ffc8e0', textMuted: 'rgba(255, 107, 173, 0.7)', glow: 'rgba(255, 107, 173, 0.5)' },
    red: { primary: '#FF6B6B', bg: '#280a0a', card: 'rgba(255, 107, 107, 0.15)', cardHover: 'rgba(255, 107, 107, 0.25)', border: 'rgba(255, 107, 107, 0.45)', text: '#ffc8c8', textMuted: 'rgba(255, 107, 107, 0.7)', glow: 'rgba(255, 107, 107, 0.5)' },
    orange: { primary: '#FFB05A', bg: '#281808', card: 'rgba(255, 176, 90, 0.15)', cardHover: 'rgba(255, 176, 90, 0.25)', border: 'rgba(255, 176, 90, 0.45)', text: '#ffe0c0', textMuted: 'rgba(255, 176, 90, 0.7)', glow: 'rgba(255, 176, 90, 0.5)' },
    yellow: { primary: '#FFE85A', bg: '#282408', card: 'rgba(255, 232, 90, 0.15)', cardHover: 'rgba(255, 232, 90, 0.25)', border: 'rgba(255, 232, 90, 0.45)', text: '#fff8c0', textMuted: 'rgba(255, 232, 90, 0.7)', glow: 'rgba(255, 232, 90, 0.5)' },
    green: { primary: '#6BF5A0', bg: '#082818', card: 'rgba(107, 245, 160, 0.15)', cardHover: 'rgba(107, 245, 160, 0.25)', border: 'rgba(107, 245, 160, 0.45)', text: '#c0ffe0', textMuted: 'rgba(107, 245, 160, 0.7)', glow: 'rgba(107, 245, 160, 0.5)' },
    teal: { primary: '#5AF0E0', bg: '#082824', card: 'rgba(90, 240, 224, 0.15)', cardHover: 'rgba(90, 240, 224, 0.25)', border: 'rgba(90, 240, 224, 0.45)', text: '#c0fff8', textMuted: 'rgba(90, 240, 224, 0.7)', glow: 'rgba(90, 240, 224, 0.5)' }
};

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
    document.getElementById('views-screen').classList.remove('active');
    document.getElementById('room-screen').classList.add('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderRoom(currentRoom);
}

function selectCubby(cubbyId) {
    currentCubby = currentRoom.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!currentCubby) return;
    currentView = 'cubby';
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('views-screen').classList.remove('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.add('active');
    renderCubby(currentCubby);
}

function goToHome() {
    currentView = 'home';
    currentRoom = null;
    currentCubby = null;
    document.getElementById('home-screen').classList.add('active');
    document.getElementById('views-screen').classList.remove('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderHome();
}

function goToRoom() {
    if (!currentRoom) return goToHome();
    currentView = 'room';
    currentCubby = null;
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('views-screen').classList.remove('active');
    document.getElementById('room-screen').classList.add('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderRoom(currentRoom);
}

function openViews() {
    currentView = 'views';
    currentRoom = null;
    currentCubby = null;
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('views-screen').classList.add('active');
    document.getElementById('room-screen').classList.remove('active');
    document.getElementById('cubby-screen').classList.remove('active');
    renderViews();
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
