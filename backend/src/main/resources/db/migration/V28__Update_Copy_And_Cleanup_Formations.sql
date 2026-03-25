-- V28: Update copy per Adrián's instructions (2026-03-25)
-- 1. Update Comercial PRO route description
-- 2. Update formation descriptions (Appointment Setter, Closer High Ticket, Cold Caller)
-- 3. Deactivate SDR/MDR formation (not in final list)
-- 4. Rename Marketing Digital route to Meta Ads, update description
-- 5. Rename "Meta Ads & Google Ads" formation to "Meta Ads", update description
-- 6. Deactivate "Lanzamientos y Evergreen" formation
-- 7. Update Fundamentos route and formation descriptions
-- 8. Update Tech & IA Specialist route description

-- == COMERCIAL PRO (Route 1) ==
UPDATE routes SET description = 'Conviértete en un profesional de ventas de alto rendimiento. Domina las habilidades comerciales más demandadas del mercado digital. Desde agendar reuniones hasta cerrar ventas de alto valor por teléfono.'
WHERE id = 1;

-- Appointment Setter (Formation 1)
UPDATE formations SET description = 'Aprende a cualificar prospectos y agendar llamadas de venta con decisores. El primer rol en cualquier equipo comercial.'
WHERE id = 1;

-- Closer High Ticket (Formation 2)
UPDATE formations SET description = 'Aprende a cerrar ventas de alto valor por teléfono. Frameworks de cierre, manejo de objeciones y psicología de venta.'
WHERE id = 2;

-- Cold Caller (Formation 4)
UPDATE formations SET description = 'Aprende a iniciar conversaciones comerciales por teléfono frío. Estructura de llamada, apertura, cualificación y transición a cita.'
WHERE id = 4;

-- Deactivate SDR/MDR (Formation 3) - not in Adrián's final list
UPDATE formations SET active = false WHERE id = 3;

-- == META ADS (Route 3, was Marketing Digital) ==
UPDATE routes SET name = 'Meta Ads', description = 'Aprende a crear, gestionar y escalar campañas de publicidad en Meta Ads. La profesión detrás del crecimiento de cualquier negocio digital.'
WHERE id = 3;

-- Rename "Meta Ads & Google Ads" to "Meta Ads" (Formation 7)
UPDATE formations SET name = 'Meta Ads', description = 'Aprende a lanzar, optimizar y escalar campañas de pago en Meta Ads. Segmentación, creativos, métricas y gestión de presupuesto.'
WHERE id = 7;

-- Deactivate "Lanzamientos y Evergreen" (Formation 8)
UPDATE formations SET active = false WHERE id = 8;

-- == FUNDAMENTOS (Route 7) ==
UPDATE routes SET description = 'La base que necesitas antes de aprender cualquier profesión digital. Contexto, mentalidad y principios para que la formación técnica produzca resultados.'
WHERE id = 7;

-- Fundamentos formation (Formation 14)
UPDATE formations SET description = 'Módulo de iniciación a las profesiones digitales. Domina los fundamentos esenciales para comenzar tu carrera digital.'
WHERE id = 14;

-- == TECH & IA SPECIALIST (Route 4) ==
UPDATE routes SET description = 'Aprende a usar inteligencia artificial y herramientas tecnológicas para resolver problemas reales de negocios. Chatbots, automatizaciones y sistemas con IA.'
WHERE id = 4;
