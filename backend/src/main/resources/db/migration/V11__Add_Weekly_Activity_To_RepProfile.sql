-- Add weekly activity tracking fields to rep_profiles table
ALTER TABLE rep_profiles
ADD COLUMN calls_made_this_week INT DEFAULT 0,
ADD COLUMN calls_made_last_week INT DEFAULT 0,
ADD COLUMN weekly_call_goal INT DEFAULT 45,
ADD COLUMN meetings_scheduled_this_week INT DEFAULT 0,
ADD COLUMN meetings_scheduled_last_week INT DEFAULT 0;
