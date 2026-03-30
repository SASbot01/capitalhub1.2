-- =====================================================
-- V29: Fix cascade deletes for admin operations
-- Add ON DELETE CASCADE to FKs that block admin deletion
-- =====================================================

-- 1. user_progress: lesson_id FK (was NO ACTION)
ALTER TABLE user_progress DROP FOREIGN KEY fk_progress_lesson;
ALTER TABLE user_progress ADD CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;

-- 2. lessons: course_id FK (was NO ACTION)
ALTER TABLE lessons DROP FOREIGN KEY fk_lesson_course;
ALTER TABLE lessons ADD CONSTRAINT fk_lesson_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
