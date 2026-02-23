// ============================================
// calendar.js - Calendar View
// ============================================

var calendarYear = new Date().getFullYear();
var calendarMonth = new Date().getMonth(); // 0-indexed
var calendarSelectedDate = null; // 'YYYY-MM-DD' string or null

// ============================================
// NAVIGATION
// ============================================

function openCalendar() {
    currentView = 'calendar';
    currentRoom = null;
    currentCubby = null;
    hideAllScreens();
    document.getElementById('calendar-screen').classList.add('active');
    renderCalendar();
    updateNavBar();
}

function calendarPrevMonth() {
    calendarMonth--;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }
    renderCalendar();
}

function calendarNextMonth() {
    calendarMonth++;
    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }
    renderCalendar();
}

function calendarGoToToday() {
    var now = new Date();
    calendarYear = now.getFullYear();
    calendarMonth = now.getMonth();
    calendarSelectedDate = formatCalendarDate(now);
    renderCalendar();
}

// ============================================
// HELPERS
// ============================================

function formatCalendarDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
}

function getMonthName(monthIndex) {
    var names = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
    return names[monthIndex];
}

function getDayNames() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

// Collect all tasks (both complete and incomplete) with due dates, grouped by date string
function collectTasksByDate() {
    var byDate = {};

    appData.rooms.forEach(function(room) {
        room.cubbies.forEach(function(cubbyRef) {
            var cubbyData = appData.cubbies[cubbyRef.id];
            if (!cubbyData) return;

            cubbyData.subcubbies.forEach(function(subcubby) {
                subcubby.tasks.forEach(function(task) {
                    if (!task.dueDate) return;

                    if (!byDate[task.dueDate]) {
                        byDate[task.dueDate] = [];
                    }
                    byDate[task.dueDate].push({
                        task: task,
                        roomId: room.id,
                        roomName: room.name,
                        cubbyId: cubbyRef.id,
                        cubbyName: cubbyRef.name,
                        cubbyColor: cubbyRef.color,
                        subcubbyId: subcubby.id,
                        subcubbyName: subcubby.name
                    });
                });
            });
        });
    });

    return byDate;
}

// Collect events grouped by date string
function collectEventsByDate() {
    var byDate = {};
    if (!appData.events) return byDate;

    appData.events.forEach(function(evt) {
        if (!evt.date) return;
        if (!byDate[evt.date]) byDate[evt.date] = [];
        byDate[evt.date].push(evt);
    });

    // Sort events within each day by start time
    Object.keys(byDate).forEach(function(date) {
        byDate[date].sort(function(a, b) {
            return (a.startTime || '').localeCompare(b.startTime || '');
        });
    });

    return byDate;
}

// ============================================
// RENDER CALENDAR
// ============================================

function renderCalendar() {
    var container = document.getElementById('calendar-container');
    if (!container) return;

    var tasksByDate = collectTasksByDate();
    var eventsByDate = collectEventsByDate();

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var todayStr = formatCalendarDate(today);

    var isCurrentMonth = (calendarYear === today.getFullYear() && calendarMonth === today.getMonth());

    // Build month header
    var html = '';
    html += '<div class="cal-header">';
    html += '<div class="cal-nav">';
    html += '<button class="cal-nav-btn" onclick="calendarPrevMonth()">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18L9 12L15 6"/></svg>';
    html += '</button>';
    html += '<div class="cal-month-label">' + getMonthName(calendarMonth) + ' ' + calendarYear + '</div>';
    html += '<button class="cal-nav-btn" onclick="calendarNextMonth()">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18L15 12L9 6"/></svg>';
    html += '</button>';
    html += '</div>';
    html += '<div class="cal-header-actions">';
    if (!isCurrentMonth || calendarSelectedDate !== todayStr) {
        html += '<button class="cal-today-btn" onclick="calendarGoToToday()">today</button>';
    }
    html += '<button class="cal-add-event-btn" onclick="openEventModal(' + (calendarSelectedDate ? '\'' + calendarSelectedDate + '\'' : 'null') + ')">';
    html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    html += '<span>event</span>';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    // Day-of-week headers
    var dayNames = getDayNames();
    html += '<div class="cal-grid cal-day-headers">';
    dayNames.forEach(function(name) {
        html += '<div class="cal-day-name">' + name + '</div>';
    });
    html += '</div>';

    // Build calendar grid
    var firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
    var daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Previous month trailing days
    var prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    html += '<div class="cal-grid cal-dates">';

    // Leading empty cells from previous month
    for (var i = 0; i < firstDay; i++) {
        var prevDay = prevMonthDays - firstDay + i + 1;
        html += '<div class="cal-cell cal-cell-outside">';
        html += '<span class="cal-date-num">' + prevDay + '</span>';
        html += '</div>';
    }

    // Actual days of the month
    for (var d = 1; d <= daysInMonth; d++) {
        var dateStr = calendarYear + '-' + String(calendarMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        var isToday = dateStr === todayStr;
        var isSelected = dateStr === calendarSelectedDate;
        var dayTasks = tasksByDate[dateStr] || [];
        var dayEvents = eventsByDate[dateStr] || [];
        var hasOverdue = false;
        var incompleteTasks = dayTasks.filter(function(item) { return !item.task.completed; });

        // Check if any incomplete tasks on this date are overdue
        if (incompleteTasks.length > 0) {
            var dateObj = new Date(dateStr + 'T00:00:00');
            if (dateObj < today) {
                hasOverdue = true;
            }
        }

        var cellClass = 'cal-cell';
        if (isToday) cellClass += ' cal-today';
        if (isSelected) cellClass += ' cal-selected';
        if (hasOverdue) cellClass += ' cal-overdue';

        html += '<div class="' + cellClass + '" onclick="selectCalendarDate(\'' + dateStr + '\')">';
        html += '<span class="cal-date-num">' + d + '</span>';

        // Event labels (max 2 visible on grid)
        if (dayEvents.length > 0) {
            html += '<div class="cal-cell-events">';
            var shownEvents = Math.min(dayEvents.length, 2);
            for (var e = 0; e < shownEvents; e++) {
                var evtColor = (colorThemes[dayEvents[e].color] || {}).primary || '#feca57';
                html += '<span class="cal-event-label" style="background:' + evtColor + '25; color:' + evtColor + '; border-color:' + evtColor + '40">' + escapeHtml(dayEvents[e].title) + '</span>';
            }
            if (dayEvents.length > 2) {
                html += '<span class="cal-event-more">+' + (dayEvents.length - 2) + ' more</span>';
            }
            html += '</div>';
        }

        // Task dots (max 4 visible, show cubby colors)
        if (dayTasks.length > 0) {
            html += '<div class="cal-dots">';
            var shown = Math.min(dayTasks.length, 4);
            for (var t = 0; t < shown; t++) {
                var dotColor = (colorThemes[dayTasks[t].cubbyColor] || {}).primary || 'rgba(255,255,255,0.4)';
                if (dayTasks[t].task.completed) {
                    dotColor = 'rgba(255,255,255,0.15)';
                }
                html += '<span class="cal-dot" style="background:' + dotColor + '"></span>';
            }
            if (dayTasks.length > 4) {
                html += '<span class="cal-dot-more">+' + (dayTasks.length - 4) + '</span>';
            }
            html += '</div>';
        }

        html += '</div>';
    }

    // Trailing empty cells for next month
    var totalCells = firstDay + daysInMonth;
    var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (var r = 1; r <= remaining; r++) {
        html += '<div class="cal-cell cal-cell-outside">';
        html += '<span class="cal-date-num">' + r + '</span>';
        html += '</div>';
    }

    html += '</div>';

    // Selected day's detail panel
    if (calendarSelectedDate) {
        var selectedTasks = tasksByDate[calendarSelectedDate] || [];
        var selectedEvents = eventsByDate[calendarSelectedDate] || [];
        var selectedDateObj = new Date(calendarSelectedDate + 'T00:00:00');
        var dayLabel = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        var totalItems = selectedEvents.length + selectedTasks.length;

        html += '<div class="cal-day-detail">';
        html += '<div class="cal-day-detail-header">';
        html += '<h2>' + dayLabel + '</h2>';
        html += '<div class="cal-day-header-right">';
        html += '<span class="cal-day-count">' + totalItems + ' item' + (totalItems !== 1 ? 's' : '') + '</span>';
        html += '<button class="cal-add-event-small" onclick="openEventModal(\'' + calendarSelectedDate + '\')" title="Add event">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        html += '</button>';
        html += '</div>';
        html += '</div>';

        // Events section
        if (selectedEvents.length > 0) {
            html += '<div class="cal-day-events">';
            selectedEvents.forEach(function(evt) {
                var evtColor = (colorThemes[evt.color] || {}).primary || '#feca57';
                var timeStr = '';
                if (evt.startTime) {
                    timeStr = formatEventTime(evt.startTime);
                    if (evt.endTime) {
                        timeStr += ' – ' + formatEventTime(evt.endTime);
                    }
                }

                html += '<div class="cal-event-card" onclick="openEventModal(null, \'' + evt.id + '\')" style="--evt-color:' + evtColor + '">';
                html += '<div class="cal-event-color-bar" style="background:' + evtColor + '"></div>';
                html += '<div class="cal-event-info">';
                html += '<span class="cal-event-title">' + escapeHtml(evt.title) + '</span>';
                if (timeStr) {
                    html += '<span class="cal-event-time">' + timeStr + '</span>';
                }
                if (evt.description) {
                    html += '<span class="cal-event-desc">' + escapeHtml(evt.description) + '</span>';
                }
                html += '</div>';
                html += '</div>';
            });
            html += '</div>';
        }

        // Tasks section
        if (selectedTasks.length > 0) {
            if (selectedEvents.length > 0) {
                html += '<div class="cal-section-label">tasks</div>';
            }

            // Sort: incomplete first, then completed; within each group sort by cubby name
            selectedTasks.sort(function(a, b) {
                if (a.task.completed !== b.task.completed) {
                    return a.task.completed ? 1 : -1;
                }
                return a.cubbyName.localeCompare(b.cubbyName);
            });

            html += '<div class="cal-day-tasks">';
            selectedTasks.forEach(function(item) {
                var themeColor = (colorThemes[item.cubbyColor] || {}).primary || '#fff';
                var completedClass = item.task.completed ? ' cal-task-done' : '';

                html += '<div class="cal-task-card' + completedClass + '" onclick="navigateToTaskFromCalendar(\'' + item.roomId + '\', \'' + item.cubbyId + '\', \'' + item.task.id + '\')">';
                html += '<div class="cal-task-check" style="border-color:' + themeColor + '">';
                if (item.task.completed) {
                    html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="' + themeColor + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                }
                html += '</div>';
                html += '<div class="cal-task-info">';
                html += '<span class="cal-task-name">' + escapeHtml(item.task.text) + '</span>';
                html += '<span class="cal-task-location" style="color:' + themeColor + '">' + escapeHtml(item.cubbyName) + '</span>';
                html += '</div>';

                // Tags
                if (item.task.tags && item.task.tags.length > 0) {
                    html += '<div class="cal-task-tags">';
                    item.task.tags.forEach(function(tag) {
                        var tagColor = (colorThemes[tag.color] || {}).primary || '#fff';
                        html += '<span class="cal-task-tag" style="background:' + tagColor + '20; color:' + tagColor + '; border: 1px solid ' + tagColor + '30">' + escapeHtml(tag.text) + '</span>';
                    });
                    html += '</div>';
                }

                html += '</div>';
            });
            html += '</div>';
        }

        // Empty state
        if (selectedEvents.length === 0 && selectedTasks.length === 0) {
            html += '<div class="cal-empty-day">no events or tasks on this day</div>';
        }

        html += '</div>';
    }

    container.innerHTML = html;
}

// ============================================
// INTERACTIONS
// ============================================

function selectCalendarDate(dateStr) {
    if (calendarSelectedDate === dateStr) {
        // Toggle off if tapping same date
        calendarSelectedDate = null;
    } else {
        calendarSelectedDate = dateStr;
    }
    renderCalendar();
}

function navigateToTaskFromCalendar(roomId, cubbyId, taskId) {
    // Navigate to the cubby containing this task
    var room = appData.rooms.find(function(r) { return r.id === roomId; });
    if (!room) return;

    currentRoom = room;

    var cubbyRef = room.cubbies.find(function(c) { return c.id === cubbyId; });
    if (!cubbyRef) return;

    currentCubby = cubbyRef;
    currentView = 'cubby';

    hideAllScreens();
    document.getElementById('cubby-screen').classList.add('active');
    renderCubby(cubbyRef);
    updateNavBar();

    // Highlight the task after render
    setTimeout(function() {
        var taskEl = document.querySelector('.task[data-id="' + taskId + '"]');
        if (taskEl) {
            taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            taskEl.classList.add('task-highlight');
            setTimeout(function() {
                taskEl.classList.remove('task-highlight');
            }, 2000);
        }
    }, 100);
}

// ============================================
// EVENT HELPERS
// ============================================

function formatEventTime(timeStr) {
    // Convert "HH:MM" (24h) to "h:mm am/pm"
    if (!timeStr) return '';
    var parts = timeStr.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var ampm = h >= 12 ? 'pm' : 'am';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return h + ':' + m + ' ' + ampm;
}

function generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// ============================================
// EVENT MODAL
// ============================================

var eventModalEditId = null; // null = new event, string = editing existing
var eventModalColor = 'yellow'; // default event color

function openEventModal(dateStr, editEventId) {
    eventModalEditId = editEventId || null;

    // Remove existing modal if any
    var existing = document.getElementById('event-modal');
    if (existing) existing.remove();

    var evt = null;
    if (eventModalEditId) {
        evt = appData.events.find(function(e) { return e.id === eventModalEditId; });
        if (!evt) return;
        eventModalColor = evt.color || 'yellow';
    } else {
        eventModalColor = 'yellow';
    }

    var dateValue = evt ? evt.date : (dateStr || calendarSelectedDate || formatCalendarDate(new Date()));
    var titleValue = evt ? escapeHtml(evt.title) : '';
    var startValue = evt ? (evt.startTime || '') : '';
    var endValue = evt ? (evt.endTime || '') : '';
    var descValue = evt ? escapeHtml(evt.description || '') : '';

    var modal = document.createElement('div');
    modal.id = 'event-modal';
    modal.className = 'modal';

    // Build color options
    var colorNames = Object.keys(colorThemes);
    var colorOptionsHtml = '';
    colorNames.forEach(function(name) {
        var theme = colorThemes[name];
        var activeClass = name === eventModalColor ? ' active' : '';
        colorOptionsHtml += '<button type="button" class="event-color-btn' + activeClass + '" data-color="' + name + '" style="background:' + theme.primary + '" onclick="selectEventColor(\'' + name + '\')"></button>';
    });

    modal.innerHTML =
        '<div class="modal-backdrop" onclick="closeEventModal()"></div>' +
        '<div class="modal-content event-modal-content">' +
            '<h2>' + (evt ? 'Edit Event' : 'New Event') + '</h2>' +
            '<input type="text" id="event-title-input" placeholder="Event name..." value="' + titleValue + '" autocomplete="off">' +
            '<div class="event-form-row">' +
                '<label for="event-date-input">Date</label>' +
                '<input type="date" id="event-date-input" value="' + dateValue + '">' +
            '</div>' +
            '<div class="event-form-row event-time-row">' +
                '<div class="event-time-field">' +
                    '<label for="event-start-time">Start</label>' +
                    '<input type="time" id="event-start-time" value="' + startValue + '">' +
                '</div>' +
                '<div class="event-time-field">' +
                    '<label for="event-end-time">End</label>' +
                    '<input type="time" id="event-end-time" value="' + endValue + '">' +
                '</div>' +
            '</div>' +
            '<div class="event-form-row">' +
                '<label>Color</label>' +
                '<div class="event-color-options" id="event-color-options">' + colorOptionsHtml + '</div>' +
            '</div>' +
            '<div class="event-form-row">' +
                '<label for="event-desc-input">Notes</label>' +
                '<textarea id="event-desc-input" placeholder="Add notes..." rows="2">' + descValue + '</textarea>' +
            '</div>' +
            '<div class="event-modal-actions">' +
                (evt ? '<button type="button" class="event-delete-btn" onclick="deleteEvent(\'' + evt.id + '\')">Delete</button>' : '') +
                '<button type="button" class="event-cancel-btn" onclick="closeEventModal()">Cancel</button>' +
                '<button type="button" class="event-save-btn" onclick="saveEvent()">Save</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);

    // Focus title input
    setTimeout(function() {
        var input = document.getElementById('event-title-input');
        if (input) input.focus();
    }, 100);

    // Enter key saves
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            saveEvent();
        }
        if (e.key === 'Escape') {
            closeEventModal();
        }
    });
}

function selectEventColor(colorName) {
    eventModalColor = colorName;
    var btns = document.querySelectorAll('.event-color-btn');
    btns.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.color === colorName);
    });
}

function closeEventModal() {
    var modal = document.getElementById('event-modal');
    if (modal) modal.remove();
    eventModalEditId = null;
}

function saveEvent() {
    var title = document.getElementById('event-title-input').value.trim();
    if (!title) {
        document.getElementById('event-title-input').focus();
        return;
    }

    var date = document.getElementById('event-date-input').value;
    var startTime = document.getElementById('event-start-time').value || '';
    var endTime = document.getElementById('event-end-time').value || '';
    var description = document.getElementById('event-desc-input').value.trim();

    if (!date) {
        date = formatCalendarDate(new Date());
    }

    if (!appData.events) appData.events = [];

    if (eventModalEditId) {
        // Edit existing
        var evt = appData.events.find(function(e) { return e.id === eventModalEditId; });
        if (evt) {
            evt.title = title;
            evt.date = date;
            evt.startTime = startTime;
            evt.endTime = endTime;
            evt.color = eventModalColor;
            evt.description = description;
        }
    } else {
        // Create new
        appData.events.push({
            id: generateEventId(),
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime,
            color: eventModalColor,
            description: description
        });
    }

    saveData();
    if (typeof syncToSupabase === 'function') syncToSupabase();
    closeEventModal();

    // If date is in the current viewed month, select it
    var evtDate = new Date(date + 'T00:00:00');
    if (evtDate.getFullYear() === calendarYear && evtDate.getMonth() === calendarMonth) {
        calendarSelectedDate = date;
    }
    renderCalendar();
}

function deleteEvent(eventId) {
    if (!appData.events) return;
    appData.events = appData.events.filter(function(e) { return e.id !== eventId; });
    saveData();
    if (typeof syncToSupabase === 'function') syncToSupabase();
    closeEventModal();
    renderCalendar();
}
