-- Create custom categories table
CREATE TABLE IF NOT EXISTS public.goal_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.goal_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own categories" ON public.goal_categories
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" ON public.goal_categories
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON public.goal_categories
FOR DELETE USING (auth.uid() = user_id);

-- Add difficulty column to goals
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'normal';

-- Update missions difficulty constraint to only allow valid values
ALTER TABLE public.missions DROP CONSTRAINT IF EXISTS missions_difficulty_check;
ALTER TABLE public.missions ADD CONSTRAINT missions_difficulty_check 
CHECK (difficulty IN ('easy', 'normal', 'hard', 'extreme'));