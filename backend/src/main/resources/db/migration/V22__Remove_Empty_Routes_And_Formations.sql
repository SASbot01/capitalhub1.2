-- V22: Remove empty/duplicate routes and formations (keep only routes with real content)

-- ============================================
-- 0. Clean up FK references first
-- ============================================

-- Remove unlock records for formations that will be deleted
DELETE FROM user_formation_unlocks WHERE formation_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Remove active formation records
DELETE FROM user_active_formations WHERE formation_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Remove certifications for these formations
DELETE FROM user_certifications WHERE formation_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Remove exam attempts
DELETE FROM user_exam_attempts WHERE formation_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Remove exam questions
DELETE FROM exam_questions WHERE formation_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Remove formation communities
DELETE FROM communities WHERE formation_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- Remove active route records for routes being deleted
DELETE FROM user_active_routes WHERE route_id IN (1, 2, 3);

-- ============================================
-- 1. Delete module 1 (Appointment Setter, no real videos)
-- ============================================
DELETE FROM modules WHERE id = 1 AND formation_id = 1;

-- ============================================
-- 2. Delete all empty formations
-- ============================================
DELETE FROM formations WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

-- ============================================
-- 3. Delete empty routes and their communities
-- ============================================
DELETE FROM communities WHERE route_id IN (1, 2, 3);
DELETE FROM routes WHERE id IN (1, 2, 3);
