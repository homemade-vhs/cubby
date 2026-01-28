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
    blue: { primary: '#5B8EFF', bg: '#0a1628', card: 'rgba(91, 142, 255, 0.12)', cardHover: 'rgba(91, 142, 255, 0.20)', border: 'rgba(91, 142, 255, 0.35)', text: '#b8d4ff', textMuted: 'rgba(91, 142, 255, 0.6)', glow: 'rgba(91, 142, 255, 0.4)' },
    purple: { primary: '#B366FF', bg: '#180a28', card: 'rgba(179, 102, 255, 0.12)', cardHover: 'rgba(179, 102, 255, 0.20)', border: 'rgba(179, 102, 255, 0.35)', text: '#ddb8ff', textMuted: 'rgba(179, 102, 255, 0.6)', glow: 'rgba(179, 102, 255, 0.4)' },
    pink: { primary: '#FF5A9E', bg: '#280a18', card: 'rgba(255, 90, 158, 0.12)', cardHover: 'rgba(255, 90, 158, 0.20)', border: 'rgba(255, 90, 158, 0.35)', text: '#ffb8d4', textMuted: 'rgba(255, 90, 158, 0.6)', glow: 'rgba(255, 90, 158, 0.4)' },
    red: { primary: '#FF5A5A', bg: '#280a0a', card: 'rgba(255, 90, 90, 0.12)', cardHover: 'rgba(255, 90, 90, 0.20)', border: 'rgba(255, 90, 90, 0.35)', text: '#ffb8b8', textMuted: 'rgba(255, 90, 90, 0.6)', glow: 'rgba(255, 90, 90, 0.4)' },
    orange: { primary: '#FF9F4A', bg: '#281808', card: 'rgba(255, 159, 74, 0.12)', cardHover: 'rgba(255, 159, 74, 0.20)', border: 'rgba(255, 159, 74, 0.35)', text: '#ffd4b8', textMuted: 'rgba(255, 159, 74, 0.6)', glow: 'rgba(255, 159, 74, 0.4)' },
    yellow: { primary: '#FFE14A', bg: '#282408', card: 'rgba(255, 225, 74, 0.12)', cardHover: 'rgba(255, 225, 74, 0.20)', border: 'rgba(255, 225, 74, 0.35)', text: '#fff4b8', textMuted: 'rgba(255, 225, 74, 0.6)', glow: 'rgba(255, 225, 74, 0.4)' },
    green: { primary: '#5AE890', bg: '#082818', card: 'rgba(90, 232, 144, 0.12)', cardHover: 'rgba(90, 232, 144, 0.20)', border: 'rgba(90, 232, 144, 0.35)', text: '#b8ffd4', textMuted: 'rgba(90, 232, 144, 0.6)', glow: 'rgba(90, 232, 144, 0.4)' },
    teal: { primary: '#40E8D4', bg: '#082824', card: 'rgba(64, 232, 212, 0.12)', cardHover: 'rgba(64, 232, 212, 0.20)', border: 'rgba(64, 232, 212, 0.35)', text: '#b8fff4', textMuted: 'rgba(64, 232, 212, 0.6)', glow: 'rgba(64, 232, 212, 0.4)' }
};

// Tag colors for task tags
var tagColors = {
    red: { bg: 'rgba(255, 107, 107, 0.25)', text: '#ff6b6b' },
    orange: { bg: 'rgba(255, 159, 67, 0.25)', text: '#ff9f43' },
    yellow: { bg: 'rgba(254, 202, 87, 0.25)', text: '#feca57' },
    green: { bg: 'rgba(46, 213, 115, 0.25)', text: '#2ed573' },
    blue: { bg: 'rgba(91, 142, 255, 0.25)', text: '#5B8EFF' },
    purple: { bg: 'rgba(165, 94, 234, 0.25)', text: '#a55eea' },
    pink: { bg: 'rgba(255, 107, 181, 0.25)', text: '#ff6bb5' },
    gray: { bg: 'rgba(255, 255, 255, 0.15)', text: 'rgba(255, 255, 255, 0.7)' }
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
