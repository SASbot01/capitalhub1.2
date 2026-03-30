-- =====================================================
-- V29: Fix cascade deletes for admin operations
-- Add ON DELETE CASCADE to FKs that block admin deletion
-- =====================================================

-- 1. user_active_routes: route_id FK
ALTER TABLE user_active_routes DROP FOREIGN KEY user_active_routes_ibfk_2;
ALTER TABLE user_active_routes ADD CONSTRAINT fk_uar_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;

-- 2. user_formation_unlocks: formation_id and route_id FKs
ALTER TABLE user_formation_unlocks DROP FOREIGN KEY user_formation_unlocks_ibfk_2;
ALTER TABLE user_formation_unlocks ADD CONSTRAINT fk_ufu_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE;

ALTER TABLE user_formation_unlocks DROP FOREIGN KEY user_formation_unlocks_ibfk_3;
ALTER TABLE user_formation_unlocks ADD CONSTRAINT fk_ufu_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;

-- 3. user_lesson_progress: lesson_id FK
ALTER TABLE user_lesson_progress DROP FOREIGN KEY fk_progress_lesson;
ALTER TABLE user_lesson_progress ADD CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;

-- 4. lessons: course_id FK (old courses table)
ALTER TABLE lessons DROP FOREIGN KEY fk_lesson_course;
ALTER TABLE lessons ADD CONSTRAINT fk_lesson_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- 5. users: trial_formation_id (if FK exists, make it cascade)
-- This column may not have a FK constraint, so we just ensure it's nullable
ALTER TABLE users MODIFY COLUMN trial_formation_id BIGINT NULL;
