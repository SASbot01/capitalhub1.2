-- Add new columns to courses table
ALTER TABLE courses
ADD COLUMN level VARCHAR(50),
ADD COLUMN focus VARCHAR(100),
ADD COLUMN image_url VARCHAR(255);

-- Add new columns to lessons table
ALTER TABLE lessons
ADD COLUMN duration VARCHAR(50),
ADD COLUMN position INT DEFAULT 0;

-- Seed some initial data to match the UI mock (optional but helpful)
-- Update existing courses or insert if empty (assuming empty for now or safe to insert)

-- Course 1: Closer
INSERT INTO courses (title, description, level, focus)
VALUES ('Cierre en lanzamientos evergreen', 'Domina el arte de cerrar ventas en modelos evergreen.', 'Intermedio', 'Closer');

-- Course 2: Setter
INSERT INTO courses (title, description, level, focus)
VALUES ('Prospección y agendas para Setters', 'Aprende a llenar calendarios con leads cualificados.', 'Básico', 'Setter');

-- Course 3: Call Caller
INSERT INTO courses (title, description, level, focus)
VALUES ('Optimización de call calling en campañas frías', 'Mejora tus métricas en llamadas en frío.', 'Avanzado', 'Setter / Closer');

-- Lessons for Course 1
SET @course1_id = (SELECT id FROM courses WHERE title = 'Cierre en lanzamientos evergreen' LIMIT 1);

-- INSERT INTO lessons (course_id, title, duration, status) VALUES (@course1_id, 'Framework de llamada de cierre', '14 min', 'completed'); -- REMOVED: status column does not exist
-- Re-reading V1__init.sql, status is indeed in user_progress. Lessons table just has content/video_url.
-- So verify schema first. V1__init.sql: lessons(id, course_id, title, content, video_url).
-- So I just add duration.

INSERT INTO lessons (course_id, title, duration, position) VALUES 
(@course1_id, 'Framework de llamada de cierre', '14 min', 1),
(@course1_id, 'Gestión de objeciones frecuentes', '18 min', 2),
(@course1_id, 'Cierre en una sola llamada', '22 min', 3),
(@course1_id, 'Seguimiento post-llamada y upsell', '16 min', 4);

-- Lessons for Course 2
SET @course2_id = (SELECT id FROM courses WHERE title = 'Prospección y agendas para Setters' LIMIT 1);
INSERT INTO lessons (course_id, title, duration, position) VALUES 
(@course2_id, 'Mentalidad del setter de alto rendimiento', '10 min', 1),
(@course2_id, 'Script base de llamadas frías', '15 min', 2),
(@course2_id, 'Uso del CRM y seguimiento diario', '20 min', 3);

-- Lessons for Course 3
SET @course3_id = (SELECT id FROM courses WHERE title = 'Optimización de call calling en campañas frías' LIMIT 1);
INSERT INTO lessons (course_id, title, duration, position) VALUES 
(@course3_id, 'KPIs clave en call calling', '12 min', 1),
(@course3_id, 'Patrones de voz y ritmo', '19 min', 2),
(@course3_id, 'Sistemas de seguimiento y batches', '17 min', 3);
