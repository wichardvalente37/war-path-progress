-- Add date fields and goal relationship to missions
ALTER TABLE public.missions
ADD COLUMN due_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
ADD COLUMN is_recurring BOOLEAN DEFAULT false,
ADD COLUMN recurrence_pattern TEXT; -- JSON string: {"days": [0,1,2,3,4,5,6]} for weekdays

-- Add category/type to goals
ALTER TABLE public.goals
ADD COLUMN category TEXT NOT NULL DEFAULT 'standard' CHECK (category IN ('standard', 'boss_battle', 'epic', 'daily', 'weekly'));

-- Add indexes for better query performance
CREATE INDEX idx_missions_due_date ON public.missions(due_date);
CREATE INDEX idx_missions_goal_id ON public.missions(goal_id);
CREATE INDEX idx_goals_category ON public.goals(category);