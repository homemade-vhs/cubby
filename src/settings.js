// ============================================
// settings.js - Settings, Archive & Trash Screens
// ============================================

// ============================================
// RENDER SETTINGS
// ============================================

function renderSettings() {
    var container = document.getElementById('settings-container');
    if (!container) return;

    var settings = appData.settings || {};
    var autoArchive = settings.autoArchive || { mode: 'duration', duration: '1week', customDays: 7, dateChange: 'new-week', weekStart: 'monday' };
    var autoTrash = settings.autoTrash || { mode: 'duration', duration: '1month', customDays: 30, dateChange: 'new-week', weekStart: 'monday' };

    var html = '';

    // ---- User Profile Section ----
    html += '<div class="settings-section">';
    html += '<div class="settings-section-header">Account</div>';
    html += '<div class="settings-card">';
    html += '<div class="settings-user-row">';
    html += '<div class="settings-user-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
    html += '<div class="settings-user-info" id="settings-user-email">Loading...</div>';
    html += '</div>';
    html += '<div class="settings-name-row">';
    html += '<label class="settings-name-label">Display Name</label>';
    html += '<input type="text" class="settings-name-input" id="settings-user-name" value="' + escapeHtml(settings.userName || '') + '" placeholder="Enter your name" onchange="setUserName(this.value)" onkeydown="if(event.key===\'Enter\'){this.blur();}">';
    html += '</div>';
    html += '<button class="settings-action-btn settings-signout" onclick="handleSignOut()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out</button>';
    html += '</div>';
    html += '</div>';

    // ---- Archive & Trash Links ----
    html += '<div class="settings-section">';
    html += '<div class="settings-section-header">Data</div>';
    html += '<div class="settings-card">';
    html += '<button class="settings-link-btn" onclick="openArchive()">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>';
    html += '<span>Archive</span>';
    html += '<span class="settings-link-count">' + (appData.archive ? appData.archive.length : 0) + '</span>';
    html += '<svg class="settings-link-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
    html += '</button>';
    html += '<button class="settings-link-btn" onclick="openTrash()">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
    html += '<span>Trash</span>';
    html += '<span class="settings-link-count">' + (appData.trash ? appData.trash.length : 0) + '</span>';
    html += '<svg class="settings-link-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    // ---- Auto-Archive Settings ----
    html += '<div class="settings-section">';
    html += '<div class="settings-section-header">Auto-Archive</div>';
    html += '<p class="settings-description">Completed tasks are automatically moved to the Archive after this period.</p>';
    html += '<div class="settings-card">';

    // Mode toggle
    html += '<div class="settings-toggle-row">';
    html += '<button class="settings-mode-btn' + (autoArchive.mode === 'duration' ? ' active' : '') + '" onclick="setArchiveMode(\'duration\')">After duration</button>';
    html += '<button class="settings-mode-btn' + (autoArchive.mode === 'date-change' ? ' active' : '') + '" onclick="setArchiveMode(\'date-change\')">On date change</button>';
    html += '</div>';

    // Duration options (shown when mode = duration)
    html += '<div id="archive-duration-options" style="' + (autoArchive.mode === 'duration' ? '' : 'display:none') + '">';
    var durations = [
        { value: 'immediate', label: 'Immediately' },
        { value: '1day', label: '1 day' },
        { value: '3days', label: '3 days' },
        { value: '1week', label: '1 week' },
        { value: '2weeks', label: '2 weeks' },
        { value: '1month', label: '1 month' },
        { value: 'custom', label: 'Custom' },
        { value: 'never', label: 'Never' }
    ];
    html += '<div class="settings-option-grid">';
    durations.forEach(function(d) {
        html += '<button class="settings-option-btn' + (autoArchive.duration === d.value ? ' active' : '') + '" onclick="setArchiveDuration(\'' + d.value + '\')">' + d.label + '</button>';
    });
    html += '</div>';
    // Custom days input
    html += '<div class="settings-custom-row" id="archive-custom-days" style="' + (autoArchive.duration === 'custom' ? '' : 'display:none') + '">';
    html += '<label>Days:</label>';
    html += '<input type="number" id="archive-custom-input" value="' + (autoArchive.customDays || 7) + '" min="1" max="365" onchange="setArchiveCustomDays(this.value)">';
    html += '</div>';
    html += '</div>';

    // Date-change options (shown when mode = date-change)
    html += '<div id="archive-datechange-options" style="' + (autoArchive.mode === 'date-change' ? '' : 'display:none') + '">';
    var dateChanges = [
        { value: 'new-day', label: 'New day' },
        { value: 'new-week', label: 'New week' },
        { value: 'new-month', label: 'New month' },
        { value: 'new-year', label: 'New year' }
    ];
    html += '<div class="settings-option-grid">';
    dateChanges.forEach(function(d) {
        html += '<button class="settings-option-btn' + (autoArchive.dateChange === d.value ? ' active' : '') + '" onclick="setArchiveDateChange(\'' + d.value + '\')">' + d.label + '</button>';
    });
    html += '</div>';
    // Week start (only when new-week)
    html += '<div class="settings-custom-row" id="archive-week-start" style="' + (autoArchive.dateChange === 'new-week' ? '' : 'display:none') + '">';
    html += '<label>Week starts on:</label>';
    html += '<div class="settings-toggle-row compact">';
    html += '<button class="settings-mode-btn' + (autoArchive.weekStart === 'monday' ? ' active' : '') + '" onclick="setArchiveWeekStart(\'monday\')">Monday</button>';
    html += '<button class="settings-mode-btn' + (autoArchive.weekStart === 'sunday' ? ' active' : '') + '" onclick="setArchiveWeekStart(\'sunday\')">Sunday</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    // ---- Auto-Trash Settings ----
    html += '<div class="settings-section">';
    html += '<div class="settings-section-header">Auto-Delete Trash</div>';
    html += '<p class="settings-description">Items in Trash are permanently deleted after this period.</p>';
    html += '<div class="settings-card">';

    // Mode toggle
    html += '<div class="settings-toggle-row">';
    html += '<button class="settings-mode-btn' + (autoTrash.mode === 'duration' ? ' active' : '') + '" onclick="setTrashMode(\'duration\')">After duration</button>';
    html += '<button class="settings-mode-btn' + (autoTrash.mode === 'date-change' ? ' active' : '') + '" onclick="setTrashMode(\'date-change\')">On date change</button>';
    html += '</div>';

    // Duration options (shown when mode = duration)
    html += '<div id="trash-duration-options" style="' + (autoTrash.mode === 'duration' || !autoTrash.mode ? '' : 'display:none') + '">';
    var trashDurations = [
        { value: 'immediate', label: 'Immediately' },
        { value: '1day', label: '1 day' },
        { value: '3days', label: '3 days' },
        { value: '1week', label: '1 week' },
        { value: '2weeks', label: '2 weeks' },
        { value: '1month', label: '1 month' },
        { value: 'custom', label: 'Custom' },
        { value: 'never', label: 'Never' }
    ];
    html += '<div class="settings-option-grid">';
    trashDurations.forEach(function(d) {
        html += '<button class="settings-option-btn' + (autoTrash.duration === d.value ? ' active' : '') + '" onclick="setTrashDuration(\'' + d.value + '\')">' + d.label + '</button>';
    });
    html += '</div>';
    // Custom days input for trash
    html += '<div class="settings-custom-row" id="trash-custom-days" style="' + (autoTrash.duration === 'custom' ? '' : 'display:none') + '">';
    html += '<label>Days:</label>';
    html += '<input type="number" id="trash-custom-input" value="' + (autoTrash.customDays || 30) + '" min="1" max="365" onchange="setTrashCustomDays(this.value)">';
    html += '</div>';
    html += '</div>';

    // Date-change options (shown when mode = date-change)
    html += '<div id="trash-datechange-options" style="' + (autoTrash.mode === 'date-change' ? '' : 'display:none') + '">';
    var trashDateChanges = [
        { value: 'new-day', label: 'New day' },
        { value: 'new-week', label: 'New week' },
        { value: 'new-month', label: 'New month' },
        { value: 'new-year', label: 'New year' }
    ];
    html += '<div class="settings-option-grid">';
    trashDateChanges.forEach(function(d) {
        html += '<button class="settings-option-btn' + ((autoTrash.dateChange || 'new-week') === d.value ? ' active' : '') + '" onclick="setTrashDateChange(\'' + d.value + '\')">' + d.label + '</button>';
    });
    html += '</div>';
    // Week start (only when new-week)
    html += '<div class="settings-custom-row" id="trash-week-start" style="' + ((autoTrash.dateChange || 'new-week') === 'new-week' ? '' : 'display:none') + '">';
    html += '<label>Week starts on:</label>';
    html += '<div class="settings-toggle-row compact">';
    html += '<button class="settings-mode-btn' + ((autoTrash.weekStart || 'monday') === 'monday' ? ' active' : '') + '" onclick="setTrashWeekStart(\'monday\')">Monday</button>';
    html += '<button class="settings-mode-btn' + ((autoTrash.weekStart || 'monday') === 'sunday' ? ' active' : '') + '" onclick="setTrashWeekStart(\'sunday\')">Sunday</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    // ---- Custom Colors ----
    html += '<div class="settings-section">';
    html += '<div class="settings-section-header">Theme Colors</div>';
    html += '<p class="settings-description">Click a color to customize it. Changes apply to all cubbies using that color.</p>';
    html += '<div class="settings-card">';
    html += '<div class="cubby-color-options">';
    var colorNames = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal'];
    var customColors = (settings.customColors) || {};
    colorNames.forEach(function(name) {
        var currentColor = colorThemes[name].primary;
        var isCustom = customColors[name] ? true : false;
        var theme = colorThemes[name];
        html += '<div class="cubby-color-swatch' + (isCustom ? ' customized' : '') + '" style="background:' + theme.card + ';border-color:' + theme.border + '" onclick="document.getElementById(\'color-pick-' + name + '\').click()">';
        html += '<span class="cubby-color-dot" style="background:' + currentColor + '"></span>';
        if (isCustom) html += '<span class="color-custom-indicator"></span>';
        html += '</div>';
        html += '<input type="color" id="color-pick-' + name + '" value="' + currentColor + '" style="display:none" onchange="setCustomColor(\'' + name + '\', this.value)">';
    });
    html += '</div>';
    var hasCustom = Object.keys(customColors).length > 0;
    if (hasCustom) {
        html += '<button class="settings-action-btn" onclick="resetAllColors()" style="margin-top: 12px;">Reset All to Defaults</button>';
    }
    html += '</div>';
    html += '</div>';;

    // ---- Version ----
    html += '<div class="settings-version">CUBBY v1.5.3</div>';

    container.innerHTML = html;

    // Load user email
    getCurrentUser().then(function(user) {
        var el = document.getElementById('settings-user-email');
        if (el && user) el.textContent = user.email;
    });
}

// ============================================
// SETTINGS HANDLERS
// ============================================

function setArchiveMode(mode) {
    appData.settings.autoArchive.mode = mode;
    saveData();
    renderSettings();
}

function setArchiveDuration(duration) {
    appData.settings.autoArchive.duration = duration;
    saveData();
    renderSettings();
}

function setArchiveCustomDays(days) {
    appData.settings.autoArchive.customDays = parseInt(days) || 7;
    saveData();
}

function setArchiveDateChange(dateChange) {
    appData.settings.autoArchive.dateChange = dateChange;
    saveData();
    renderSettings();
}

function setArchiveWeekStart(day) {
    appData.settings.autoArchive.weekStart = day;
    saveData();
    renderSettings();
}

function setTrashDuration(duration) {
    appData.settings.autoTrash.duration = duration;
    saveData();
    renderSettings();
}

function setTrashCustomDays(days) {
    appData.settings.autoTrash.customDays = parseInt(days) || 30;
    saveData();
}

function setTrashMode(mode) {
    appData.settings.autoTrash.mode = mode;
    saveData();
    renderSettings();
}

function setTrashDateChange(dateChange) {
    appData.settings.autoTrash.dateChange = dateChange;
    saveData();
    renderSettings();
}

function setTrashWeekStart(day) {
    appData.settings.autoTrash.weekStart = day;
    saveData();
    renderSettings();
}

function setUserName(name) {
    appData.settings.userName = name.trim();
    saveData();
    // Update greeting and nav bar immediately
    if (typeof updateGreeting === 'function') updateGreeting();
}

function setCustomColor(name, hex) {
    if (!appData.settings.customColors) appData.settings.customColors = {};
    appData.settings.customColors[name] = hex;
    colorThemes[name] = generateThemeFromHex(hex);
    saveData();
    renderSettings();
}

function resetAllColors(name) {
    delete appData.settings.customColors;
    // Restore defaults
    Object.keys(defaultColorThemes).forEach(function(key) {
        colorThemes[key] = JSON.parse(JSON.stringify(defaultColorThemes[key]));
    });
    saveData();
    renderSettings();
}

// ============================================
// RENDER ARCHIVE
// ============================================

function renderArchive() {
    var container = document.getElementById('archive-container');
    if (!container) return;

    var archive = appData.archive || [];

    if (archive.length === 0) {
        container.innerHTML = '<div class="archive-empty animate-in delay-1">No archived items</div>';
        return;
    }

    var html = '';
    html += '<div class="archive-summary animate-in delay-1">' + archive.length + ' archived item' + (archive.length !== 1 ? 's' : '') + '</div>';

    // Show most recent first
    for (var i = archive.length - 1; i >= 0; i--) {
        var entry = archive[i];
        var typeLabel = entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
        var itemName = getArchiveItemName(entry);
        var sourcePath = getSourcePath(entry.source);
        var dateStr = formatRelativeDate(entry.archivedAt);

        html += '<div class="archive-item animate-in delay-1">';
        html += '<div class="archive-item-type">' + typeLabel + '</div>';
        html += '<div class="archive-item-name">' + escapeHtml(itemName) + '</div>';
        if (sourcePath) {
            html += '<div class="archive-item-source">' + escapeHtml(sourcePath) + '</div>';
        }
        html += '<div class="archive-item-date">Archived ' + dateStr + '</div>';
        html += '<div class="archive-item-actions">';
        html += '<button class="archive-action-btn restore" onclick="restoreArchiveItem(' + i + ')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Restore</button>';
        html += '<button class="archive-action-btn delete" onclick="deleteArchiveItem(' + i + ')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete</button>';
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
}

function restoreArchiveItem(index) {
    restoreFromArchive(index);
    renderArchive();
}

function deleteArchiveItem(index) {
    var entry = appData.archive[index];
    if (!entry) return;

    // Move from archive to trash
    trashItem(entry.type, entry.item, entry.source);
    appData.archive.splice(index, 1);
    saveData();
    renderArchive();
}

// ============================================
// RENDER TRASH
// ============================================

function renderTrash() {
    var container = document.getElementById('trash-container');
    if (!container) return;

    var trash = appData.trash || [];

    if (trash.length === 0) {
        container.innerHTML = '<div class="archive-empty animate-in delay-1">Trash is empty</div>';
        return;
    }

    var html = '';
    html += '<div class="archive-summary animate-in delay-1">';
    html += '<span>' + trash.length + ' item' + (trash.length !== 1 ? 's' : '') + ' in trash</span>';
    html += '<button class="empty-trash-btn" onclick="confirmEmptyTrash()">Empty Trash</button>';
    html += '</div>';

    // Show most recent first
    for (var i = trash.length - 1; i >= 0; i--) {
        var entry = trash[i];
        var typeLabel = entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
        var itemName = getTrashItemName(entry);
        var sourcePath = getSourcePath(entry.source);
        var dateStr = formatRelativeDate(entry.deletedAt);

        html += '<div class="archive-item trash-item animate-in delay-1">';
        html += '<div class="archive-item-type">' + typeLabel + '</div>';
        html += '<div class="archive-item-name">' + escapeHtml(itemName) + '</div>';
        if (sourcePath) {
            html += '<div class="archive-item-source">' + escapeHtml(sourcePath) + '</div>';
        }
        html += '<div class="archive-item-date">Deleted ' + dateStr + '</div>';
        html += '<div class="archive-item-actions">';
        html += '<button class="archive-action-btn restore" onclick="restoreTrashItem(' + i + ')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Restore</button>';
        html += '<button class="archive-action-btn delete" onclick="confirmDeleteTrashItem(' + i + ')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete Forever</button>';
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
}

function restoreTrashItem(index) {
    restoreFromTrash(index);
    renderTrash();
}

function confirmDeleteTrashItem(index) {
    showConfirmDialog('Delete forever?', 'This item will be permanently deleted and cannot be recovered.', function() {
        permanentlyDeleteTrashItem(index);
        renderTrash();
    });
}

function confirmEmptyTrash() {
    showConfirmDialog('Empty trash?', 'All ' + appData.trash.length + ' items will be permanently deleted and cannot be recovered.', function() {
        emptyTrash();
        renderTrash();
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getArchiveItemName(entry) {
    if (entry.type === 'task' || entry.type === 'subtask') {
        return entry.item.text || 'Untitled';
    } else if (entry.type === 'subcubby') {
        return entry.item.name || 'Untitled';
    } else if (entry.type === 'cubby') {
        return entry.item.ref ? entry.item.ref.name : 'Untitled';
    }
    return 'Untitled';
}

function getTrashItemName(entry) {
    if (entry.type === 'task' || entry.type === 'subtask') {
        return entry.item.text || 'Untitled';
    } else if (entry.type === 'subcubby') {
        return entry.item.name || 'Untitled';
    } else if (entry.type === 'cubby') {
        return entry.item.ref ? entry.item.ref.name : 'Untitled';
    } else if (entry.type === 'room') {
        return entry.item.room ? entry.item.room.name : 'Untitled';
    }
    return 'Untitled';
}

function getSourcePath(source) {
    if (!source) return '';
    var parts = [];
    if (source.roomName) parts.push(source.roomName);
    if (source.cubbyName) parts.push(source.cubbyName);
    if (source.subcubbyName) parts.push(source.subcubbyName);
    return parts.join(' > ');
}

function formatRelativeDate(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    var now = new Date();
    var diffMs = now - date;
    var diffMins = Math.floor(diffMs / 60000);
    var diffHours = Math.floor(diffMs / 3600000);
    var diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + 'w ago';

    var options = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
    }
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
