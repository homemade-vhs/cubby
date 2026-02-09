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
    cubbies: {}
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
            if (!appData.settings) appData.settings = {};
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
}

function showNavBar() {
    var nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'flex';
}

function hideNavBar() {
    var nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'none';
}

function updateNavUserName(name) {
    // Nav tab always shows "user" — display name is used in greeting only
}

function openProfileMenu() {
    openSettings();
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
    renderHome();
}

function toggleHomeSection(sectionId) {
    var section = appData.settings.homeLayout.find(function(s) { return s.id === sectionId; });
    if (section) {
        section.visible = !section.visible;
        saveData();
        renderHome();
    }
}

function moveHomeSectionUp(sectionId) {
    var index = appData.settings.homeLayout.findIndex(function(s) { return s.id === sectionId; });
    if (index > 0) {
        var temp = appData.settings.homeLayout[index];
        appData.settings.homeLayout[index] = appData.settings.homeLayout[index - 1];
        appData.settings.homeLayout[index - 1] = temp;
        saveData();
        renderHome();
    }
}

function moveHomeSectionDown(sectionId) {
    var index = appData.settings.homeLayout.findIndex(function(s) { return s.id === sectionId; });
    if (index >= 0 && index < appData.settings.homeLayout.length - 1) {
        var temp = appData.settings.homeLayout[index];
        appData.settings.homeLayout[index] = appData.settings.homeLayout[index + 1];
        appData.settings.homeLayout[index + 1] = temp;
        saveData();
        renderHome();
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Load data on page load
loadData();
applyCustomColors();
