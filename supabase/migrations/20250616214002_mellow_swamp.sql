/*
  # Update todos table for TaskFlow compatibility

  1. Changes to existing todos table
    - Add `emoji` column for task emojis
    - Add `project_id` column to link tasks to projects
    - Update foreign key constraint for project relationship
    - Ensure all required columns exist with proper defaults

  2. Security
    - Policies already exist and are compatible

  3. Indexes
    - Add index on project_id for performance
*/

-- Add emoji column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'todos' AND column_name = 'emoji'
  ) THEN
    ALTER TABLE todos ADD COLUMN emoji text DEFAULT '📝';
  END IF;
END $$;

-- Add project_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'todos' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE todos ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index on project_id for performance
CREATE INDEX IF NOT EXISTS idx_todos_project_id ON todos(project_id);

-- Create index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);

-- Create index on completed status
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);