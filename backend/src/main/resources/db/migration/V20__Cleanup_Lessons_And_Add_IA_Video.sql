-- V20: Cleanup lessons without real videos + add IA video + fix Profesión Digital

-- ============================================
-- 1. PROFESIÓN DIGITAL (formation 14, route 7)
-- ============================================

-- Delete orphan lesson from V19 (no module_id)
DELETE FROM lessons WHERE id = 110;

-- Update real video durations in Module 1 (id=17)
UPDATE lessons SET duration = '34 min' WHERE id = 84;  -- Bienvenida
UPDATE lessons SET duration = '12 min' WHERE id = 85;  -- Qué es una profesión digital
UPDATE lessons SET duration = '17 min' WHERE id = 86;  -- El mercado digital actual

-- Replace lesson 87 (no video "Elige tu camino") with the new video
UPDATE lessons SET
    title = 'Tu camino en el mundo digital',
    content = 'Descubre las oportunidades y elige tu profesión digital.',
    video_url = 'https://assets.cdn.filesafe.space/fPSTvVgtLrLaVpNFx8ix/media/69bc2c8b2f5f656ad24a6cdf.mov',
    duration = '8 min'
WHERE id = 87;

-- Delete all lessons from modules 18, 19, 20 (no videos)
DELETE FROM lessons WHERE module_id IN (18, 19, 20);

-- Delete empty modules 18, 19, 20
DELETE FROM modules WHERE id IN (18, 19, 20);

-- ============================================
-- 2. IA - DOMINANDO LA IA PARA NEGOCIOS (formation 11, route 4)
-- ============================================

-- Delete all lessons without real video from modules 5, 6, 7, 8
DELETE FROM lessons WHERE module_id IN (5, 6, 7, 8);

-- Add the real IA video to module 5 (Introducción a la IA)
INSERT INTO lessons (course_id, module_id, title, content, duration, position, video_url)
VALUES (
    (SELECT MIN(id) FROM courses),
    5,
    'Dominando la IA para Negocios',
    'Clase completa sobre inteligencia artificial aplicada a negocios digitales.',
    '31 min',
    1,
    'https://assets.cdn.filesafe.space/fPSTvVgtLrLaVpNFx8ix/media/69ba97b95b4de59f22e537d6.mov'
);

-- Delete empty modules 6, 7, 8 (no lessons left)
DELETE FROM modules WHERE id IN (6, 7, 8);

-- ============================================
-- 3. APPOINTMENT SETTER (formation 1) - Module 1
-- ============================================

-- Lessons 11-14 have example.com placeholder URLs → remove them
DELETE FROM lessons WHERE module_id = 1 AND video_url LIKE '%example.com%';

-- Delete modules 2, 3, 4 of Appointment Setter (no lessons with real videos)
-- First delete any lessons in those modules
DELETE FROM lessons WHERE module_id IN (2, 3, 4);
-- Then delete the empty modules
DELETE FROM modules WHERE id IN (2, 3, 4) AND formation_id = 1;

-- ============================================
-- 4. LEGACY LESSONS (no module_id, old course system)
-- ============================================

-- Delete all legacy lessons without module_id (old course-based, no real videos)
DELETE FROM lessons WHERE module_id IS NULL AND (video_url IS NULL OR video_url LIKE '%example.com%');

-- ============================================
-- 5. CLEANUP: Formations without any modules/content
-- ============================================

-- Remove formations that have zero modules (pure filler)
-- Formations 2 (Closer), 3 (SDR), 4 (Cold Caller) in Comercial PRO
-- Formations 5 (CRMs), 6 (Dashboards) in Tech & IA
-- Formations 7 (Meta Ads), 8 (Lanzamientos) in Marketing
-- Formations 9 (Prompt Eng), 10 (Automatización IA) in IA
DELETE FROM formations WHERE id IN (2, 3, 4, 5, 6, 7, 8, 9, 10)
    AND id NOT IN (SELECT DISTINCT formation_id FROM modules WHERE formation_id IS NOT NULL);

-- Remove routes with no formations left
-- Route 2 (Tech Specialist) was merged into route 4
-- Route 3 (Marketing Digital) has no content
DELETE FROM communities WHERE route_id IN (
    SELECT id FROM routes WHERE id NOT IN (SELECT DISTINCT route_id FROM formations)
);
DELETE FROM routes WHERE id NOT IN (SELECT DISTINCT route_id FROM formations);
