-- V19: Add video to Profesión Digital formation + Reset rep.t0/rep.t1 subscriptions

-- ============================================
-- 1. Add video lesson to MIFG Fundamentos (Profesión Digital)
-- ============================================

-- Get the formation and its first module
SET @formation_mifg = (SELECT id FROM formations WHERE name = 'MIFG Fundamentos' LIMIT 1);
SET @module_mifg = (SELECT id FROM modules WHERE formation_id = @formation_mifg ORDER BY display_order ASC LIMIT 1);
SET @course_mifg = (SELECT MIN(course_id) FROM lessons WHERE module_id = @module_mifg);
SET @next_position = (SELECT COALESCE(MAX(position), 0) + 1 FROM lessons WHERE module_id = @module_mifg);

-- If no course_id reference exists yet, use a fallback (first course)
SET @course_mifg = COALESCE(@course_mifg, (SELECT MIN(id) FROM courses));

INSERT INTO lessons (course_id, module_id, title, content, duration, position, video_url)
VALUES (
    @course_mifg,
    @module_mifg,
    'Profesión Digital - Formación Completa',
    'Vídeo formativo sobre profesión digital y fundamentos esenciales para tu carrera.',
    '0 min',
    @next_position,
    'https://assets.cdn.filesafe.space/fPSTvVgtLrLaVpNFx8ix/media/69bc2c8b2f5f656ad24a6cdf.mov'
);

-- ============================================
-- 2. Reset monthly subscriptions for rep.t0 and rep.t1
-- ============================================

-- Reset rep.t0 (Trial - 14 days from now)
UPDATE users
SET tier_expires_at = DATE_ADD(NOW(), INTERVAL 14 DAY)
WHERE email = 'rep.t0@test.com';

-- Reset rep.t1 (Basic - 30 days from now)
UPDATE users
SET tier_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
WHERE email = 'rep.t1@test.com';
