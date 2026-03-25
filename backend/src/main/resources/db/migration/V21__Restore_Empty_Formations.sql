-- V21: Restore routes and formations as visible cards (empty, no filler modules)

-- ============================================
-- 1. RESTORE DELETED ROUTES
-- ============================================

-- Route 2: Tech Specialist (was merged into 4, but user wants card visible)
INSERT IGNORE INTO routes (id, name, description, display_order, image_url, active) VALUES
(2, 'Tech Specialist', 'Automatiza procesos y optimiza sistemas digitales. Conviértete en el operador técnico que toda empresa necesita.', 2, '/images/routes/tech-specialist.jpg', TRUE);

-- Route 3: Marketing Digital Specialist
INSERT IGNORE INTO routes (id, name, description, display_order, image_url, active) VALUES
(3, 'Marketing Digital Specialist', 'Campañas, embudos y estrategias de crecimiento. Aprende a escalar negocios con marketing digital.', 3, '/images/routes/marketing-digital.jpg', TRUE);

-- ============================================
-- 2. RESTORE DELETED FORMATIONS (empty, no modules)
-- ============================================

-- Comercial PRO (route 1)
INSERT IGNORE INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(2, 1, 'Closer High Ticket', 'Domina el arte de cerrar ventas de alto valor. Aprende frameworks de cierre y gestión de objeciones.', 'Intermedio', 2, TRUE),
(3, 1, 'SDR/MDR', 'Prospección y desarrollo de ventas B2B. Conviértete en un Sales Development Representative profesional.', 'Intermedio', 3, TRUE),
(4, 1, 'Cold Caller', 'Optimización de llamadas en frío. Aprende a convertir llamadas frías en oportunidades calientes.', 'Avanzado', 4, TRUE);

-- Tech Specialist (route 2)
INSERT IGNORE INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(5, 2, 'Automatización con CRMs', 'Domina HubSpot, GoHighLevel y sistemas de automatización. Crea flujos que ahorran horas de trabajo.', 'Intermedio', 1, TRUE),
(6, 2, 'Dashboards y Reporting', 'Visualización de datos y KPIs. Aprende a crear dashboards que toman decisiones.', 'Básico', 2, TRUE);

-- Marketing Digital Specialist (route 3)
INSERT IGNORE INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(7, 3, 'Meta Ads & Google Ads', 'Domina campañas de pago en las plataformas más importantes. Aprende a escalar con ROAS positivo.', 'Intermedio', 1, TRUE),
(8, 3, 'Lanzamientos y Evergreen', 'Diseña y ejecuta lanzamientos digitales. Crea embudos evergreen que venden 24/7.', 'Avanzado', 2, TRUE);

-- Tech & IA Specialist (route 4) - Prompt Engineering and Automatización IA
INSERT IGNORE INTO formations (id, route_id, name, description, level, display_order, active) VALUES
(9, 4, 'Prompt Engineering', 'Domina ChatGPT y herramientas de IA. Aprende a crear prompts que generan resultados profesionales.', 'Básico', 1, TRUE),
(10, 4, 'Automatización con IA', 'Flujos automatizados con IA. Integra IA en procesos de negocio reales.', 'Intermedio', 2, TRUE);

-- ============================================
-- 3. RESTORE COMMUNITIES FOR RESTORED ROUTES
-- ============================================

INSERT IGNORE INTO communities (name, type, route_id, external_link, description) VALUES
('Comunidad Tech Specialist', 'ROUTE', 2, 'https://discord.gg/techspecialist', 'Comunidad de especialistas técnicos'),
('Comunidad Marketing Digital', 'ROUTE', 3, 'https://discord.gg/marketing', 'Comunidad de marketers digitales');

-- ============================================
-- 4. CLEAR DUPLICATE UNLOCK ATTEMPTS
-- ============================================
-- Remove duplicate unlock for formation 1 if user clicks again (safe: keeps first)
-- No action needed - the backend already validates before inserting.
-- The 400 error is correct behavior, frontend should handle it gracefully.
