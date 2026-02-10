// ============================================
// sync.js - Supabase Data Sync
// ============================================
// This file handles loading data from Supabase,
// syncing changes back to the cloud, and migrating
// existing localStorage data.
// ============================================

// ============================================
// UUID GENERATION
// ============================================

function generateUUID() {
    // crypto.randomUUID() works in all modern browsers
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ============================================
// LOAD ALL DATA FROM SUPABASE
// ============================================

async function loadFromSupabase() {
    var user = await getCurrentUser();
    if (!user) return false;

    try {
        // Fetch all 5 tables in parallel
        var results = await Promise.all([
            sb.from('workspaces').select('*').eq('user_id', user.id).order('position'),
            sb.from('cubbies').select('*').order('position'),
            sb.from('subcubbies').select('*').order('position'),
            sb.from('tasks').select('*').order('position'),
            sb.from('subtasks').select('*').order('position')
        ]);

        // Check for errors
        for (var i = 0; i < results.length; i++) {
            if (results[i].error) {
                console.error('Supabase load error:', results[i].error.message);
                return false;
            }
        }

        var workspaces = results[0].data;
        var cubbies = results[1].data;
        var subcubbiesData = results[2].data;
        var tasksData = results[3].data;
        var subtasksData = results[4].data;

        // If user has no workspaces, they need defaults or migration
        if (workspaces.length === 0) {
            return false; // Let showApp handle migration or defaults
        }

        // RECONSTRUCT NESTED appData STRUCTURE

        // Step 1: Index subtasks by task_id
        var subtasksByTask = {};
        subtasksData.forEach(function(st) {
            if (!subtasksByTask[st.task_id]) subtasksByTask[st.task_id] = [];
            subtasksByTask[st.task_id].push({
                id: st.id,
                text: st.text,
                completed: st.completed,
                dueDate: st.due_date ? st.due_date.split('T')[0] : null,
                tags: st.tags || []
            });
        });

        // Step 2: Index tasks by subcubby_id
        var tasksBySubcubby = {};
        tasksData.forEach(function(t) {
            if (!tasksBySubcubby[t.subcubby_id]) tasksBySubcubby[t.subcubby_id] = [];
            tasksBySubcubby[t.subcubby_id].push({
                id: t.id,
                text: t.text,
                completed: t.completed,
                expanded: false,
                dueDate: t.due_date ? t.due_date.split('T')[0] : null,
                tags: t.tags || [],
                memo: t.memo || '',
                subtasks: subtasksByTask[t.id] || []
            });
        });

        // Step 3: Index subcubbies by cubby_id
        var subcubbiesByCubby = {};
        subcubbiesData.forEach(function(sc) {
            if (!subcubbiesByCubby[sc.cubby_id]) subcubbiesByCubby[sc.cubby_id] = [];
            subcubbiesByCubby[sc.cubby_id].push({
                id: sc.id,
                name: sc.name,
                expanded: true,
                tasks: tasksBySubcubby[sc.id] || []
            });
        });

        // Step 4: Index cubbies by workspace_id
        var cubbiesByWorkspace = {};
        cubbies.forEach(function(c) {
            if (!cubbiesByWorkspace[c.workspace_id]) cubbiesByWorkspace[c.workspace_id] = [];
            cubbiesByWorkspace[c.workspace_id].push({
                id: c.id,
                name: c.name,
                color: c.color || 'purple'
            });
        });

        // Step 5: Build appData
        // Preserve local room colors in case Supabase doesn't have a color column yet
        var localRoomColors = {};
        if (appData && appData.rooms) {
            appData.rooms.forEach(function(r) {
                if (r.color) localRoomColors[r.id] = r.color;
            });
        }
        
        // Preserve existing settings, archive, and trash
        var existingSettings = appData.settings || {};
        var existingArchive = appData.archive || [];
        var existingTrash = appData.trash || [];
        
        appData = {
            rooms: workspaces.map(function(w) {
                var room = {
                    id: w.id,
                    name: w.name,
                    cubbies: cubbiesByWorkspace[w.id] || []
                };
                if (w.color) {
                    room.color = w.color;
                } else if (localRoomColors[w.id]) {
                    room.color = localRoomColors[w.id];
                }
                return room;
            }),
            cubbies: {},
            settings: existingSettings,
            archive: existingArchive,
            trash: existingTrash
        };

        // Step 6: Build cubbies lookup (task data by cubby ID)
        cubbies.forEach(function(c) {
            appData.cubbies[c.id] = {
                subcubbies: subcubbiesByCubby[c.id] || []
            };
        });

        // Cache to localStorage
        saveData();
        return true;
    } catch (e) {
        console.error('Error loading from Supabase:', e);
        return false;
    }
}

// ============================================
// CREATE DEFAULT DATA IN SUPABASE
// ============================================

async function initializeSupabaseDefaults(userId) {
    try {
        // Create default workspace
        var wsResult = await sb.from('workspaces')
            .insert({ user_id: userId, name: 'My Workspace', position: 0 })
            .select().single();
        if (wsResult.error) { console.error('Error creating workspace:', wsResult.error.message); return false; }

        // Create default cubby
        var cubbyResult = await sb.from('cubbies')
            .insert({ workspace_id: wsResult.data.id, name: 'Tasks', color: 'purple', position: 0 })
            .select().single();
        if (cubbyResult.error) { console.error('Error creating cubby:', cubbyResult.error.message); return false; }

        // Create default subcubby
        var subResult = await sb.from('subcubbies')
            .insert({ cubby_id: cubbyResult.data.id, name: 'General', position: 0 })
            .select().single();
        if (subResult.error) { console.error('Error creating subcubby:', subResult.error.message); return false; }

        return true;
    } catch (e) {
        console.error('Error creating defaults:', e);
        return false;
    }
}

// ============================================
// MIGRATE LOCALSTORAGE DATA TO SUPABASE
// ============================================

async function migrateLocalDataToSupabase(userId) {
    var localData = null;
    try {
        var stored = localStorage.getItem('cubby_data');
        if (stored) localData = JSON.parse(stored);
    } catch (e) {
        console.error('Error reading localStorage:', e);
    }

    if (!localData || !localData.rooms || localData.rooms.length === 0) {
        return false; // Nothing to migrate
    }

    console.log('Migrating localStorage data to Supabase...');

    try {
        // Walk through the nested structure top-down
        for (var ri = 0; ri < localData.rooms.length; ri++) {
            var room = localData.rooms[ri];
            var newWorkspaceId = generateUUID();

            // Insert workspace
            var wsResult = await sb.from('workspaces')
                .insert({ id: newWorkspaceId, user_id: userId, name: room.name, position: ri })
                .select().single();
            if (wsResult.error) { console.error('Migration error (workspace):', wsResult.error.message); continue; }

            if (!room.cubbies) continue;

            for (var ci = 0; ci < room.cubbies.length; ci++) {
                var cubbyRef = room.cubbies[ci];
                var newCubbyId = generateUUID();

                // Insert cubby
                var cubbyResult = await sb.from('cubbies')
                    .insert({ id: newCubbyId, workspace_id: newWorkspaceId, name: cubbyRef.name, color: cubbyRef.color || 'purple', position: ci })
                    .select().single();
                if (cubbyResult.error) { console.error('Migration error (cubby):', cubbyResult.error.message); continue; }

                var cubbyData = localData.cubbies[cubbyRef.id];
                if (!cubbyData || !cubbyData.subcubbies) continue;

                for (var si = 0; si < cubbyData.subcubbies.length; si++) {
                    var subcubby = cubbyData.subcubbies[si];
                    var newSubcubbyId = generateUUID();

                    // Insert subcubby
                    var subResult = await sb.from('subcubbies')
                        .insert({ id: newSubcubbyId, cubby_id: newCubbyId, name: subcubby.name, position: si })
                        .select().single();
                    if (subResult.error) { console.error('Migration error (subcubby):', subResult.error.message); continue; }

                    if (!subcubby.tasks) continue;

                    for (var ti = 0; ti < subcubby.tasks.length; ti++) {
                        var task = subcubby.tasks[ti];
                        var newTaskId = generateUUID();

                        // Insert task
                        var taskResult = await sb.from('tasks')
                            .insert({
                                id: newTaskId,
                                subcubby_id: newSubcubbyId,
                                text: task.text,
                                completed: task.completed || false,
                                expanded: false,
                                due_date: task.dueDate || null,
                                tags: task.tags || [],
                                memo: task.memo || '',
                                position: ti
                            })
                            .select().single();
                        if (taskResult.error) { console.error('Migration error (task):', taskResult.error.message); continue; }

                        if (!task.subtasks) continue;

                        for (var sti = 0; sti < task.subtasks.length; sti++) {
                            var subtask = task.subtasks[sti];
                            var newSubtaskId = generateUUID();

                            // Insert subtask
                            var stResult = await sb.from('subtasks')
                                .insert({
                                    id: newSubtaskId,
                                    task_id: newTaskId,
                                    text: subtask.text,
                                    completed: subtask.completed || false,
                                    due_date: subtask.dueDate || null,
                                    tags: subtask.tags || [],
                                    position: sti
                                });
                            if (stResult.error) { console.error('Migration error (subtask):', stResult.error.message); }
                        }
                    }
                }
            }
        }

        console.log('Migration complete!');
        return true;
    } catch (e) {
        console.error('Migration failed:', e);
        return false;
    }
}

// ============================================
// TASK SYNC FUNCTIONS
// ============================================

function syncInsertTask(id, subcubbyId, text, dueDate, tags, memo, position) {
    sb.from('tasks').insert({
        id: id,
        subcubby_id: subcubbyId,
        text: text,
        completed: false,
        expanded: false,
        due_date: dueDate || null,
        tags: tags || [],
        memo: memo || '',
        position: position
    }).then(function(res) {
        if (res.error) console.error('Sync error (insertTask):', res.error.message);
    });
}

function syncUpdateTask(id, fields) {
    sb.from('tasks').update(fields).eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (updateTask):', res.error.message);
    });
}

function syncDeleteTask(id) {
    sb.from('tasks').delete().eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (deleteTask):', res.error.message);
    });
}

// ============================================
// SUBTASK SYNC FUNCTIONS
// ============================================

function syncInsertSubtask(id, taskId, text, dueDate, tags, position) {
    sb.from('subtasks').insert({
        id: id,
        task_id: taskId,
        text: text,
        completed: false,
        due_date: dueDate || null,
        tags: tags || [],
        position: position
    }).then(function(res) {
        if (res.error) console.error('Sync error (insertSubtask):', res.error.message);
    });
}

function syncUpdateSubtask(id, fields) {
    sb.from('subtasks').update(fields).eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (updateSubtask):', res.error.message);
    });
}

function syncDeleteSubtask(id) {
    sb.from('subtasks').delete().eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (deleteSubtask):', res.error.message);
    });
}

// ============================================
// WORKSPACE SYNC FUNCTIONS
// ============================================

function syncInsertWorkspace(id, userId, name, position) {
    sb.from('workspaces').insert({
        id: id, user_id: userId, name: name, position: position
    }).then(function(res) {
        if (res.error) console.error('Sync error (insertWorkspace):', res.error.message);
    });
}

function syncUpdateWorkspace(id, fields) {
    sb.from('workspaces').update(fields).eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (updateWorkspace):', res.error.message);
    });
}

function syncDeleteWorkspace(id) {
    sb.from('workspaces').delete().eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (deleteWorkspace):', res.error.message);
    });
}

// ============================================
// CUBBY SYNC FUNCTIONS
// ============================================

function syncInsertCubby(id, workspaceId, name, color, position) {
    sb.from('cubbies').insert({
        id: id, workspace_id: workspaceId, name: name, color: color, position: position
    }).then(function(res) {
        if (res.error) console.error('Sync error (insertCubby):', res.error.message);
    });
}

function syncUpdateCubby(id, fields) {
    sb.from('cubbies').update(fields).eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (updateCubby):', res.error.message);
    });
}

function syncDeleteCubby(id) {
    sb.from('cubbies').delete().eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (deleteCubby):', res.error.message);
    });
}

// ============================================
// SUBCUBBY SYNC FUNCTIONS
// ============================================

function syncInsertSubcubby(id, cubbyId, name, position) {
    sb.from('subcubbies').insert({
        id: id, cubby_id: cubbyId, name: name, position: position
    }).then(function(res) {
        if (res.error) console.error('Sync error (insertSubcubby):', res.error.message);
    });
}

function syncUpdateSubcubby(id, fields) {
    sb.from('subcubbies').update(fields).eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (updateSubcubby):', res.error.message);
    });
}

function syncDeleteSubcubby(id) {
    sb.from('subcubbies').delete().eq('id', id).then(function(res) {
        if (res.error) console.error('Sync error (deleteSubcubby):', res.error.message);
    });
}

// ============================================
// POSITION SYNC (batch update positions)
// ============================================

function syncUpdatePositions(table, items) {
    // items is an array of {id, position}
    items.forEach(function(item) {
        sb.from(table).update({ position: item.position }).eq('id', item.id).then(function(res) {
            if (res.error) console.error('Sync error (position):', res.error.message);
        });
    });
}

// ============================================
// HELPER: Build position array from ordered list
// ============================================

function buildPositionArray(orderedItems, idField) {
    return orderedItems.map(function(item, index) {
        return { id: item[idField || 'id'], position: index };
    });
}
