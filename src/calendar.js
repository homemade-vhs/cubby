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

// ============================================
// RENDER CALENDAR
// ============================================

function renderCalendar() {
    var container = document.getElementById('calendar-container');
    if (!container) return;

    var tasksByDate = collectTasksByDate();

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
    if (!isCurrentMonth || calendarSelectedDate !== todayStr) {
        html += '<button class="cal-today-btn" onclick="calendarGoToToday()">today</button>';
    }
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

    // Selected day's task list
    if (calendarSelectedDate) {
        var selectedTasks = tasksByDate[calendarSelectedDate] || [];
        var selectedDateObj = new Date(calendarSelectedDate + 'T00:00:00');
        var dayLabel = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        html += '<div class="cal-day-detail">';
        html += '<div class="cal-day-detail-header">';
        html += '<h2>' + dayLabel + '</h2>';
        html += '<span class="cal-day-count">' + selectedTasks.length + ' task' + (selectedTasks.length !== 1 ? 's' : '') + '</span>';
        html += '</div>';

        if (selectedTasks.length === 0) {
            html += '<div class="cal-empty-day">no tasks on this day</div>';
        } else {
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
