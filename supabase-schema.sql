-- ============================================
-- CUBBY SUPABASE DATABASE SCHEMA
-- ============================================
-- This schema converts the localStorage structure to a relational database
-- Designed for Supabase (PostgreSQL)

-- ============================================
-- TABLES
-- ============================================

-- Users table (handled by Supabase Auth, but we reference it)
-- No need to create this - Supabase provides auth.users

-- User preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  color_display_mode TEXT NOT NULL DEFAULT 'custom' CHECK (color_display_mode IN ('custom', 'due_date', 'priority', 'grayscale')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspaces table (top-level containers, replaces "rooms")
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0, -- for ordering workspaces
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cubbies table (belong to workspaces)
CREATE TABLE cubbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL, -- hex code like #C77DFF
  position INTEGER NOT NULL DEFAULT 0, -- for ordering cubbies within a workspace
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subcubbies table (belong to cubbies, like sections)
CREATE TABLE subcubbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cubby_id UUID NOT NULL REFERENCES cubbies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  expanded BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0, -- for ordering subcubbies within a cubby
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table (belong to subcubbies)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcubby_id UUID NOT NULL REFERENCES subcubbies(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  note TEXT, -- optional longer description/notes
  completed BOOLEAN NOT NULL DEFAULT false,
  expanded BOOLEAN NOT NULL DEFAULT false,
  priority TEXT CHECK (priority IN ('backburner', 'normal', 'high', 'urgent')), -- NULL = no priority
  due_date TIMESTAMPTZ, -- optional, with date and time
  release_date TIMESTAMPTZ, -- optional separate release date
  position INTEGER NOT NULL DEFAULT 0, -- for ordering tasks within a subcubby
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ -- timestamp when task was completed
);

-- Subtasks table (belong to tasks)
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  note TEXT, -- optional longer description/notes
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT CHECK (priority IN ('backburner', 'normal', 'high', 'urgent')), -- NULL = no priority
  due_date TIMESTAMPTZ, -- optional, with date and time
  release_date TIMESTAMPTZ, -- optional separate release date
  position INTEGER NOT NULL DEFAULT 0, -- for ordering subtasks within a task
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ -- timestamp when subtask was completed
);

-- Tags table (many-to-many with tasks and subtasks)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name) -- each user can only have one tag with a given name
);

-- Task tags junction table
CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (task_id, tag_id)
);

-- Subtask tags junction table
CREATE TABLE subtask_tags (
  subtask_id UUID NOT NULL REFERENCES subtasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subtask_id, tag_id)
);

-- ============================================
-- SHARING TABLES
-- ============================================

-- Workspace sharing (share entire workspaces with other users)
CREATE TABLE workspace_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit')) DEFAULT 'view',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, shared_with_user_id) -- can't share same workspace twice with same user
);

-- Cubby sharing (share individual cubbies)
CREATE TABLE cubby_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cubby_id UUID NOT NULL REFERENCES cubbies(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit')) DEFAULT 'view',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cubby_id, shared_with_user_id)
);

-- Task sharing (share individual tasks)
CREATE TABLE task_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit')) DEFAULT 'view',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(task_id, shared_with_user_id)
);

-- ============================================
-- SAVED VIEWS / FILTERS
-- ============================================

-- Saved views table (custom filtered perspectives)
CREATE TABLE saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "This Week", "High Priority", "Overdue"
  filter_config JSONB NOT NULL, -- stores the filter rules (completed, priority, due date range, tags, etc.)
  position INTEGER NOT NULL DEFAULT 0, -- for ordering saved views
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Indexes for common queries
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_workspaces_position ON workspaces(user_id, position);

CREATE INDEX idx_cubbies_workspace_id ON cubbies(workspace_id);
CREATE INDEX idx_cubbies_position ON cubbies(workspace_id, position);

CREATE INDEX idx_subcubbies_cubby_id ON subcubbies(cubby_id);
CREATE INDEX idx_subcubbies_position ON subcubbies(cubby_id, position);

CREATE INDEX idx_tasks_subcubby_id ON tasks(subcubby_id);
CREATE INDEX idx_tasks_position ON tasks(subcubby_id, position);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_priority ON tasks(priority) WHERE priority IS NOT NULL;
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_release_date ON tasks(release_date) WHERE release_date IS NOT NULL;

CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_position ON subtasks(task_id, position);
CREATE INDEX idx_subtasks_completed ON subtasks(completed);
CREATE INDEX idx_subtasks_priority ON subtasks(priority) WHERE priority IS NOT NULL;

CREATE INDEX idx_tags_user_id ON tags(user_id);

CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);

CREATE INDEX idx_subtask_tags_subtask_id ON subtask_tags(subtask_id);
CREATE INDEX idx_subtask_tags_tag_id ON subtask_tags(tag_id);

CREATE INDEX idx_workspace_shares_workspace_id ON workspace_shares(workspace_id);
CREATE INDEX idx_workspace_shares_shared_with ON workspace_shares(shared_with_user_id);

CREATE INDEX idx_cubby_shares_cubby_id ON cubby_shares(cubby_id);
CREATE INDEX idx_cubby_shares_shared_with ON cubby_shares(shared_with_user_id);

CREATE INDEX idx_task_shares_task_id ON task_shares(task_id);
CREATE INDEX idx_task_shares_shared_with ON task_shares(shared_with_user_id);

CREATE INDEX idx_saved_views_user_id ON saved_views(user_id);
CREATE INDEX idx_saved_views_position ON saved_views(user_id, position);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Triggers to auto-update updated_at columns
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cubbies_updated_at BEFORE UPDATE ON cubbies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcubbies_updated_at BEFORE UPDATE ON subcubbies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at BEFORE UPDATE ON subtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_views_updated_at BEFORE UPDATE ON saved_views
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE cubbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcubbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtask_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE cubby_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Workspaces policies (users can only see their own workspaces)
CREATE POLICY "Users can view their own workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = user_id);

-- Cubbies policies (users can only see cubbies in their workspaces)
CREATE POLICY "Users can view cubbies in their workspaces"
  ON cubbies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workspaces WHERE workspaces.id = cubbies.workspace_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert cubbies in their workspaces"
  ON cubbies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM workspaces WHERE workspaces.id = cubbies.workspace_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can update cubbies in their workspaces"
  ON cubbies FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM workspaces WHERE workspaces.id = cubbies.workspace_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete cubbies in their workspaces"
  ON cubbies FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM workspaces WHERE workspaces.id = cubbies.workspace_id AND workspaces.user_id = auth.uid()
  ));

-- Subcubbies policies
CREATE POLICY "Users can view subcubbies in their cubbies"
  ON subcubbies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM cubbies
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE cubbies.id = subcubbies.cubby_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert subcubbies in their cubbies"
  ON subcubbies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM cubbies
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE cubbies.id = subcubbies.cubby_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can update subcubbies in their cubbies"
  ON subcubbies FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM cubbies
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE cubbies.id = subcubbies.cubby_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete subcubbies in their cubbies"
  ON subcubbies FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM cubbies
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE cubbies.id = subcubbies.cubby_id AND workspaces.user_id = auth.uid()
  ));

-- Tasks policies
CREATE POLICY "Users can view tasks in their subcubbies"
  ON tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM subcubbies
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE subcubbies.id = tasks.subcubby_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert tasks in their subcubbies"
  ON tasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM subcubbies
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE subcubbies.id = tasks.subcubby_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can update tasks in their subcubbies"
  ON tasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM subcubbies
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE subcubbies.id = tasks.subcubby_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tasks in their subcubbies"
  ON tasks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM subcubbies
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE subcubbies.id = tasks.subcubby_id AND workspaces.user_id = auth.uid()
  ));

-- Subtasks policies (accessible if user owns the task OR task is shared with them)
CREATE POLICY "Users can view subtasks of their tasks or shared tasks"
  ON subtasks FOR SELECT
  USING (
    -- User owns the task through workspace hierarchy
    EXISTS (
      SELECT 1 FROM tasks
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE tasks.id = subtasks.task_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user
    EXISTS (
      SELECT 1 FROM task_shares
      WHERE task_shares.task_id = subtasks.task_id
        AND task_shares.shared_with_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert subtasks for their tasks or shared tasks with edit permission"
  ON subtasks FOR INSERT
  WITH CHECK (
    -- User owns the task
    EXISTS (
      SELECT 1 FROM tasks
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE tasks.id = subtasks.task_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user with edit permission
    EXISTS (
      SELECT 1 FROM task_shares
      WHERE task_shares.task_id = subtasks.task_id
        AND task_shares.shared_with_user_id = auth.uid()
        AND task_shares.permission_level = 'edit'
    )
  );

CREATE POLICY "Users can update subtasks of their tasks or shared tasks with edit permission"
  ON subtasks FOR UPDATE
  USING (
    -- User owns the task
    EXISTS (
      SELECT 1 FROM tasks
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE tasks.id = subtasks.task_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user with edit permission
    EXISTS (
      SELECT 1 FROM task_shares
      WHERE task_shares.task_id = subtasks.task_id
        AND task_shares.shared_with_user_id = auth.uid()
        AND task_shares.permission_level = 'edit'
    )
  );

CREATE POLICY "Users can delete subtasks of their tasks or shared tasks with edit permission"
  ON subtasks FOR DELETE
  USING (
    -- User owns the task
    EXISTS (
      SELECT 1 FROM tasks
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE tasks.id = subtasks.task_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user with edit permission
    EXISTS (
      SELECT 1 FROM task_shares
      WHERE task_shares.task_id = subtasks.task_id
        AND task_shares.shared_with_user_id = auth.uid()
        AND task_shares.permission_level = 'edit'
    )
  );

-- Tags policies (users can only see their own tags)
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- Task tags policies (users can only tag their own tasks)
CREATE POLICY "Users can view tags on their tasks"
  ON task_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tasks
    JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE tasks.id = task_tags.task_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can add tags to their tasks"
  ON task_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks
    JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE tasks.id = task_tags.task_id AND workspaces.user_id = auth.uid()
  ));

CREATE POLICY "Users can remove tags from their tasks"
  ON task_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM tasks
    JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
    JOIN cubbies ON cubbies.id = subcubbies.cubby_id
    JOIN workspaces ON workspaces.id = cubbies.workspace_id
    WHERE tasks.id = task_tags.task_id AND workspaces.user_id = auth.uid()
  ));

-- Subtask tags policies (users can tag their own subtasks or subtasks of shared tasks)
CREATE POLICY "Users can view tags on their subtasks or shared task subtasks"
  ON subtask_tags FOR SELECT
  USING (
    -- User owns the task
    EXISTS (
      SELECT 1 FROM subtasks
      JOIN tasks ON tasks.id = subtasks.task_id
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE subtasks.id = subtask_tags.subtask_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user
    EXISTS (
      SELECT 1 FROM subtasks
      JOIN task_shares ON task_shares.task_id = subtasks.task_id
      WHERE subtasks.id = subtask_tags.subtask_id
        AND task_shares.shared_with_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add tags to their subtasks or shared task subtasks with edit permission"
  ON subtask_tags FOR INSERT
  WITH CHECK (
    -- User owns the task
    EXISTS (
      SELECT 1 FROM subtasks
      JOIN tasks ON tasks.id = subtasks.task_id
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE subtasks.id = subtask_tags.subtask_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user with edit permission
    EXISTS (
      SELECT 1 FROM subtasks
      JOIN task_shares ON task_shares.task_id = subtasks.task_id
      WHERE subtasks.id = subtask_tags.subtask_id
        AND task_shares.shared_with_user_id = auth.uid()
        AND task_shares.permission_level = 'edit'
    )
  );

CREATE POLICY "Users can remove tags from their subtasks or shared task subtasks with edit permission"
  ON subtask_tags FOR DELETE
  USING (
    -- User owns the task
    EXISTS (
      SELECT 1 FROM subtasks
      JOIN tasks ON tasks.id = subtasks.task_id
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE subtasks.id = subtask_tags.subtask_id AND workspaces.user_id = auth.uid()
    )
    OR
    -- Task has been shared with user with edit permission
    EXISTS (
      SELECT 1 FROM subtasks
      JOIN task_shares ON task_shares.task_id = subtasks.task_id
      WHERE subtasks.id = subtask_tags.subtask_id
        AND task_shares.shared_with_user_id = auth.uid()
        AND task_shares.permission_level = 'edit'
    )
  );

-- ============================================
-- SHARING POLICIES
-- ============================================

-- Workspace shares policies
CREATE POLICY "Users can view shares for their workspaces"
  ON workspace_shares FOR SELECT
  USING (
    auth.uid() = shared_by_user_id OR
    auth.uid() = shared_with_user_id
  );

CREATE POLICY "Users can share their own workspaces"
  ON workspace_shares FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by_user_id AND
    EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = workspace_id AND workspaces.user_id = auth.uid())
  );

CREATE POLICY "Users can delete shares they created"
  ON workspace_shares FOR DELETE
  USING (auth.uid() = shared_by_user_id);

-- Cubby shares policies
CREATE POLICY "Users can view shares for their cubbies"
  ON cubby_shares FOR SELECT
  USING (
    auth.uid() = shared_by_user_id OR
    auth.uid() = shared_with_user_id
  );

CREATE POLICY "Users can share their own cubbies"
  ON cubby_shares FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by_user_id AND
    EXISTS (
      SELECT 1 FROM cubbies
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE cubbies.id = cubby_id AND workspaces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shares they created"
  ON cubby_shares FOR DELETE
  USING (auth.uid() = shared_by_user_id);

-- Task shares policies
CREATE POLICY "Users can view shares for their tasks"
  ON task_shares FOR SELECT
  USING (
    auth.uid() = shared_by_user_id OR
    auth.uid() = shared_with_user_id
  );

CREATE POLICY "Users can share their own tasks"
  ON task_shares FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by_user_id AND
    EXISTS (
      SELECT 1 FROM tasks
      JOIN subcubbies ON subcubbies.id = tasks.subcubby_id
      JOIN cubbies ON cubbies.id = subcubbies.cubby_id
      JOIN workspaces ON workspaces.id = cubbies.workspace_id
      WHERE tasks.id = task_id AND workspaces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shares they created"
  ON task_shares FOR DELETE
  USING (auth.uid() = shared_by_user_id);

-- Saved views policies
CREATE POLICY "Users can view their own saved views"
  ON saved_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved views"
  ON saved_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved views"
  ON saved_views FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved views"
  ON saved_views FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- NOTES
-- ============================================

-- Key differences from localStorage structure:
-- 1. Using UUIDs instead of simple string IDs (e.g., 't123456789')
-- 2. Added user_id to support multi-user with Supabase Auth
-- 3. Renamed "rooms" to "workspaces" (keeping "room" available for future House feature)
-- 4. Added position fields for manual ordering without array indexes
-- 5. Added created_at/updated_at timestamps for all records
-- 6. Added completed_at timestamp for tasks/subtasks
-- 7. Normalized tags into separate table (currently stored as inline arrays in localStorage)
-- 8. All foreign keys have CASCADE DELETE for clean data removal
-- 9. Row Level Security ensures users only see their own data
-- 10. Added user_preferences table for display settings (color modes, etc.)
-- 11. Added sharing tables (workspace_shares, cubby_shares, task_shares) for collaboration
-- 12. Added saved_views table for custom filtered perspectives
-- 13. Added note field to tasks/subtasks for longer descriptions
-- 14. Added priority field (NULL, 'backburner', 'normal', 'high', 'urgent')
-- 15. Changed due_date from DATE to TIMESTAMPTZ to support optional time
-- 16. Added release_date TIMESTAMPTZ field (separate from due_date)
-- 17. Changed cubby color from enum to TEXT to support custom hex codes

-- Tag handling:
-- In localStorage: tasks.tags = ['tagName1', 'tagName2'] (inline array with colors)
-- In database: tags are separate entities that can be reused across tasks
-- The app will need to be updated to create/reuse tags by name+color

-- Ordering:
-- In localStorage: order is determined by array position
-- In database: order is determined by the 'position' integer field
-- When reordering, update the position values accordingly

-- Color handling:
-- Cubbies now store full hex codes (e.g., '#C77DFF') instead of color names
-- This allows for custom colors per cubby
-- User preferences table has color_display_mode for future dynamic coloring:
--   - 'custom': Use cubby's custom color
--   - 'due_date': Color based on due date status (red=overdue, yellow=soon, etc.)
--   - 'priority': Color based on priority level
--   - 'grayscale': Monochrome UI with colored accents

-- Sharing:
-- Three levels of sharing: workspace, cubby, and individual task
-- Each share has permission_level: 'view' or 'edit'
-- Users can only share items they own
-- Shared items are visible to both the sharer and the recipient
-- IMPORTANT: When a task is shared, ALL subtasks are automatically accessible
--   - 'view' permission: user can see task, subtasks, and all their tags
--   - 'edit' permission: user can modify task, add/edit/delete subtasks, and manage tags

-- Saved Views:
-- Stores filter configurations as JSONB for flexible querying
-- Example filter_config: {"completed": false, "priority": ["high", "urgent"], "due_within_days": 7}
-- Position field allows user to order their custom views
