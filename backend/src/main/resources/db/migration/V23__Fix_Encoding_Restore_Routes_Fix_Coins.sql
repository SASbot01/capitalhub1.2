-- V23: Fix encoding, restore Comercial PRO & Marketing routes, fix coin balances

-- ============================================
-- 1. FIX ENCODING: Correct corrupted UTF-8 text
-- ============================================

-- Fix route 7 (Profesión Digital) - name and description
UPDATE routes SET
    name = 'Profesión Digital',
    description = 'Descubre las profesiones digitales más demandadas. Aprende los fundamentos para iniciar tu carrera en el mundo digital.',
    image_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
WHERE id = 7;

-- Fix formation 14 (MIFG Fundamentos)
UPDATE formations SET
    name = 'MIFG - Fundamentos',
    description = 'Módulo de iniciación a las profesiones digitales. Aprende los fundamentos esenciales para comenzar tu carrera digital.'
WHERE id = 14;

-- Fix formation 11 (Dominando la IA para Negocios)
UPDATE formations SET
    description = 'Formación completa en Inteligencia Artificial aplicada: desde los fundamentos hasta la construcción de productos y ofertas con IA.'
WHERE id = 11;

-- ============================================
-- 2. RESTORE: Comercial PRO route + formations
-- ============================================

INSERT INTO routes (id, name, description, display_order, image_url, active) VALUES
(1, 'Comercial PRO', 'Conviértete en un profesional de ventas de alto rendimiento. Domina técnicas de cierre, prospección y gestión comercial B2B.', 1, 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=600&fit=crop', TRUE)
ON DUPLICATE KEY UPDATE name='Comercial PRO',
    description='Conviértete en un profesional de ventas de alto rendimiento. Domina técnicas de cierre, prospección y gestión comercial B2B.',
    display_order=1,
    image_url='https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=600&fit=crop',
    active=TRUE;

-- Comercial PRO formations (empty - no modules yet but visible)
INSERT INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(1, 1, 'Appointment Setter', 'Aprende a agendar citas de calidad con decisores. El primer paso para una carrera en ventas digitales.', 'Básico', 1, TRUE)
ON DUPLICATE KEY UPDATE name='Appointment Setter',
    description='Aprende a agendar citas de calidad con decisores. El primer paso para una carrera en ventas digitales.',
    route_id=1, level='Básico', display_order=1, active=TRUE;

INSERT INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(2, 1, 'Closer High Ticket', 'Domina el arte de cerrar ventas de alto valor. Aprende frameworks de cierre y gestión de objeciones.', 'Intermedio', 2, TRUE)
ON DUPLICATE KEY UPDATE name='Closer High Ticket',
    description='Domina el arte de cerrar ventas de alto valor. Aprende frameworks de cierre y gestión de objeciones.',
    route_id=1, level='Intermedio', display_order=2, active=TRUE;

INSERT INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(3, 1, 'SDR/MDR', 'Prospección y desarrollo de ventas B2B. Conviértete en un Sales Development Representative profesional.', 'Intermedio', 3, TRUE)
ON DUPLICATE KEY UPDATE name='SDR/MDR',
    description='Prospección y desarrollo de ventas B2B. Conviértete en un Sales Development Representative profesional.',
    route_id=1, level='Intermedio', display_order=3, active=TRUE;

INSERT INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(4, 1, 'Cold Caller', 'Optimización de llamadas en frío. Aprende a convertir llamadas frías en oportunidades calientes.', 'Avanzado', 4, TRUE)
ON DUPLICATE KEY UPDATE name='Cold Caller',
    description='Optimización de llamadas en frío. Aprende a convertir llamadas frías en oportunidades calientes.',
    route_id=1, level='Avanzado', display_order=4, active=TRUE;

-- ============================================
-- 3. RESTORE: Marketing Digital route + formations
-- ============================================

INSERT INTO routes (id, name, description, display_order, image_url, active) VALUES
(3, 'Marketing Digital', 'Campañas, embudos y estrategias de crecimiento. Aprende a escalar negocios con marketing digital.', 3, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', TRUE)
ON DUPLICATE KEY UPDATE name='Marketing Digital',
    description='Campañas, embudos y estrategias de crecimiento. Aprende a escalar negocios con marketing digital.',
    display_order=3,
    image_url='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    active=TRUE;

-- Marketing formations (empty - no modules yet but visible)
INSERT INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(7, 3, 'Meta Ads & Google Ads', 'Domina campañas de pago en las plataformas más importantes. Aprende a escalar con ROAS positivo.', 'Intermedio', 1, TRUE)
ON DUPLICATE KEY UPDATE name='Meta Ads & Google Ads',
    description='Domina campañas de pago en las plataformas más importantes. Aprende a escalar con ROAS positivo.',
    route_id=3, level='Intermedio', display_order=1, active=TRUE;

INSERT INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(8, 3, 'Lanzamientos y Evergreen', 'Diseña y ejecuta lanzamientos digitales. Crea embudos evergreen que venden 24/7.', 'Avanzado', 2, TRUE)
ON DUPLICATE KEY UPDATE name='Lanzamientos y Evergreen',
    description='Diseña y ejecuta lanzamientos digitales. Crea embudos evergreen que venden 24/7.',
    route_id=3, level='Avanzado', display_order=2, active=TRUE;

-- ============================================
-- 4. FIX DISPLAY ORDER for all routes
-- ============================================

UPDATE routes SET display_order = 1 WHERE id = 1;  -- Comercial PRO
UPDATE routes SET display_order = 2 WHERE id = 4;  -- Tech & IA Specialist
UPDATE routes SET display_order = 3 WHERE id = 3;  -- Marketing Digital
UPDATE routes SET display_order = 4 WHERE id = 7;  -- Profesión Digital

-- ============================================
-- 5. FIX COIN BALANCES: Set NULL to 0
-- ============================================

UPDATE users SET coin_balance = 0 WHERE coin_balance IS NULL;

-- Give T1 test user 2 coins (welcome bonus they should have received)
UPDATE users SET coin_balance = 2 WHERE email = 'rep.t1@test.com' AND coin_balance = 0;
