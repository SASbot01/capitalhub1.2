-- V13: Seed Training Data for Capital Hub
-- Initial routes, formations, modules, and communities

-- ============================================
-- ROUTE 1: COMERCIAL PRO
-- ============================================
INSERT INTO routes (name, description, display_order, image_url) VALUES
('Comercial PRO', 'Domina las profesiones digitales más demandadas en ventas. Aprende a generar valor real en el mercado comercial digital.', 1, '/images/routes/comercial-pro.jpg');

SET @route_comercial = LAST_INSERT_ID();

-- Formations within Comercial PRO
INSERT INTO formations (route_id, name, description, level, display_order) VALUES
(@route_comercial, 'Appointment Setter', 'Aprende a llenar calendarios con leads cualificados. Domina la prospección y agendamiento de citas de alto valor.', 'Básico', 1),
(@route_comercial, 'Closer High Ticket', 'Domina el arte de cerrar ventas de alto valor. Aprende frameworks de cierre y gestión de objeciones.', 'Intermedio', 2),
(@route_comercial, 'SDR/MDR', 'Prospección y desarrollo de ventas B2B. Conviértete en un Sales Development Representative profesional.', 'Intermedio', 3),
(@route_comercial, 'Cold Caller', 'Optimización de llamadas en frío. Aprende a convertir llamadas frías en oportunidades calientes.', 'Avanzado', 4);

-- Sample modules for Appointment Setter
SET @formation_setter = (SELECT id FROM formations WHERE name = 'Appointment Setter' LIMIT 1);

INSERT INTO modules (formation_id, name, description, display_order) VALUES
(@formation_setter, 'Módulo 1: Fundamentos del Setter', 'Mentalidad, herramientas y primeros pasos como setter profesional', 1),
(@formation_setter, 'Módulo 2: Scripts y Frameworks', 'Aprende los scripts que funcionan y cómo adaptarlos', 2),
(@formation_setter, 'Módulo 3: CRM y Seguimiento', 'Domina el uso del CRM y sistemas de seguimiento', 3),
(@formation_setter, 'Módulo 4: Optimización y KPIs', 'Métricas clave y cómo mejorar tu performance', 4);

-- Sample lessons for Module 1
SET @module1_setter = (SELECT id FROM modules WHERE formation_id = @formation_setter AND display_order = 1 LIMIT 1);

INSERT INTO lessons (course_id, module_id, title, content, duration, position, video_url) VALUES
(1, @module1_setter, 'Bienvenida al programa Setter', 'Introducción al programa y qué esperar', '8 min', 1, 'https://example.com/video1'),
(1, @module1_setter, 'Mentalidad del setter de alto rendimiento', 'Cómo pensar como un setter profesional', '12 min', 2, 'https://example.com/video2'),
(1, @module1_setter, 'Herramientas esenciales', 'CRM, teléfono, calendario y más', '15 min', 3, 'https://example.com/video3'),
(1, @module1_setter, 'Tu primer día como setter', 'Paso a paso de tu primera jornada', '10 min', 4, 'https://example.com/video4');


-- ============================================
-- ROUTE 2: TECH SPECIALIST
-- ============================================
INSERT INTO routes (name, description, display_order, image_url) VALUES
('Tech Specialist', 'Automatiza procesos y optimiza sistemas digitales. Conviértete en el operador técnico que toda empresa necesita.', 2, '/images/routes/tech-specialist.jpg');

SET @route_tech = LAST_INSERT_ID();

INSERT INTO formations (route_id, name, description, level, display_order) VALUES
(@route_tech, 'Automatización con CRMs', 'Domina HubSpot, GoHighLevel y sistemas de automatización. Crea flujos que ahorran horas de trabajo.', 'Intermedio', 1),
(@route_tech, 'Dashboards y Reporting', 'Visualización de datos y KPIs. Aprende a crear dashboards que toman decisiones.', 'Básico', 2);

-- ============================================
-- ROUTE 3: MARKETING DIGITAL SPECIALIST
-- ============================================
INSERT INTO routes (name, description, display_order, image_url) VALUES
('Marketing Digital Specialist', 'Campañas, embudos y estrategias de crecimiento. Aprende a escalar negocios con marketing digital.', 3, '/images/routes/marketing-digital.jpg');

SET @route_marketing = LAST_INSERT_ID();

INSERT INTO formations (route_id, name, description, level, display_order) VALUES
(@route_marketing, 'Meta Ads & Google Ads', 'Domina campañas de pago en las plataformas más importantes. Aprende a escalar con ROAS positivo.', 'Intermedio', 1),
(@route_marketing, 'Lanzamientos y Evergreen', 'Diseña y ejecuta lanzamientos digitales. Crea embudos evergreen que venden 24/7.', 'Avanzado', 2);

-- ============================================
-- ROUTE 4: IA SPECIALIST
-- ============================================
INSERT INTO routes (name, description, display_order, image_url) VALUES
('Especialista en IA Aplicada', 'Inteligencia artificial para negocios digitales. Aprende a usar IA para multiplicar tu productividad.', 4, '/images/routes/ia-specialist.jpg');

SET @route_ia = LAST_INSERT_ID();

INSERT INTO formations (route_id, name, description, level, display_order) VALUES
(@route_ia, 'Prompt Engineering', 'Domina ChatGPT y herramientas de IA. Aprende a crear prompts que generan resultados profesionales.', 'Básico', 1),
(@route_ia, 'Automatización con IA', 'Flujos automatizados con IA. Integra IA en procesos de negocio reales.', 'Intermedio', 2);

-- ============================================
-- COMMUNITIES
-- ============================================

-- Route-level communities
INSERT INTO communities (name, type, route_id, external_link, description) VALUES
('Comunidad Comercial PRO', 'ROUTE', @route_comercial, 'https://discord.gg/comercialpro', 'Comunidad de profesionales comerciales digitales'),
('Comunidad Tech Specialist', 'ROUTE', @route_tech, 'https://discord.gg/techspecialist', 'Comunidad de especialistas técnicos'),
('Comunidad Marketing Digital', 'ROUTE', @route_marketing, 'https://discord.gg/marketing', 'Comunidad de marketers digitales'),
('Comunidad IA Specialist', 'ROUTE', @route_ia, 'https://discord.gg/ia', 'Comunidad de especialistas en IA');

-- Formation-specific communities (example for Setter)
INSERT INTO communities (name, type, formation_id, external_link, description) VALUES
('Comunidad Setters', 'FORMATION', @formation_setter, 'https://discord.gg/setters', 'Comunidad exclusiva de Appointment Setters');

-- ============================================
-- SAMPLE EXAM QUESTIONS (for Appointment Setter)
-- ============================================

INSERT INTO exam_questions (formation_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
(@formation_setter, '¿Cuál es el objetivo principal de un Appointment Setter?', 
 'Cerrar ventas directamente', 
 'Agendar citas cualificadas para closers', 
 'Crear contenido para redes sociales', 
 'Gestionar el CRM de la empresa', 
 'B'),

(@formation_setter, '¿Qué métrica es más importante para un setter?', 
 'Número de llamadas realizadas', 
 'Tasa de conversión de llamada a cita agendada', 
 'Tiempo promedio por llamada', 
 'Número de rechazos', 
 'B'),

(@formation_setter, 'En una llamada de prospección, ¿cuándo debes mencionar el precio?', 
 'Al inicio de la llamada', 
 'Nunca, eso lo hace el closer', 
 'Cuando el lead pregunta directamente', 
 'Al final de la llamada', 
 'B'),

(@formation_setter, '¿Qué es un lead cualificado?', 
 'Cualquier persona que responde el teléfono', 
 'Alguien con interés, presupuesto y autoridad de decisión', 
 'Alguien que ya compró antes', 
 'Alguien que sigue la empresa en redes', 
 'B'),

(@formation_setter, '¿Cuál es la mejor práctica para el seguimiento de leads?', 
 'Llamar una sola vez y olvidar', 
 'Insistir hasta que compren', 
 'Seguir un sistema estructurado de seguimiento', 
 'Esperar a que ellos te llamen', 
 'C'),

(@formation_setter, '¿Qué herramienta es esencial para un setter profesional?', 
 'Photoshop', 
 'CRM (Customer Relationship Management)', 
 'Excel avanzado', 
 'Editor de video', 
 'B'),

(@formation_setter, '¿Cuál es el tono ideal en una llamada de prospección?', 
 'Agresivo y urgente', 
 'Profesional, amigable y consultivo', 
 'Casual y relajado', 
 'Formal y distante', 
 'B'),

(@formation_setter, '¿Qué debes hacer si un lead dice "no tengo tiempo ahora"?', 
 'Insistir en que solo tomará 2 minutos', 
 'Colgar inmediatamente', 
 'Preguntar cuándo sería mejor momento y reagendar', 
 'Enviar un email largo explicando todo', 
 'C'),

(@formation_setter, '¿Cuántas citas debe agendar un setter profesional por día (promedio)?', 
 '1-2 citas', 
 '3-5 citas', 
 '10-15 citas', 
 'Depende del nicho y calidad de leads', 
 'D'),

(@formation_setter, '¿Qué es más importante: cantidad o calidad de citas?', 
 'Cantidad siempre', 
 'Calidad siempre', 
 'Depende de la estrategia de la empresa', 
 'Ninguna de las anteriores', 
 'B');
