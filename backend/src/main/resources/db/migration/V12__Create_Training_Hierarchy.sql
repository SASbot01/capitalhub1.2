-- V12: Create Training Hierarchy for Capital Hub
-- Routes → Formations → Modules → Lessons
-- Includes: Certifications, Streaks, Communities, Exams

-- 1. ROUTES (e.g., "Comercial PRO", "Tech Specialist", "Marketing Digital")
CREATE TABLE routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. FORMATIONS (e.g., "Setter", "Closer", "SDR" within "Comercial PRO")
CREATE TABLE formations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    level VARCHAR(50), -- Básico, Intermedio, Avanzado
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_formation_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 3. MODULES (e.g., "Módulo 1: Fundamentos")
CREATE TABLE modules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    formation_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_module_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- 4. UPDATE LESSONS TABLE to link to modules
ALTER TABLE lessons
ADD COLUMN module_id BIGINT,
ADD CONSTRAINT fk_lesson_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE;

-- 5. USER ACTIVE FORMATION (one at a time - enforces focus)
CREATE TABLE user_active_formations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    formation_id BIGINT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uaf_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_uaf_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- 6. USER CERTIFICATIONS
CREATE TABLE user_certifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    formation_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    exam_score INT,
    passed BOOLEAN DEFAULT FALSE,
    certified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 7. USER STREAKS (gamification - daily activity tracking)
CREATE TABLE user_streaks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_streak_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. COMMUNITIES (route-level and formation-level)
CREATE TABLE communities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'ROUTE' or 'FORMATION'
    route_id BIGINT,
    formation_id BIGINT,
    external_link VARCHAR(500), -- Discord/WhatsApp link for V1
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    CONSTRAINT fk_community_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- 9. EXAM QUESTIONS (for certification)
CREATE TABLE exam_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    formation_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(500),
    option_b VARCHAR(500),
    option_c VARCHAR(500),
    option_d VARCHAR(500),
    correct_answer CHAR(1), -- 'A', 'B', 'C', 'D'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exam_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- 10. USER EXAM ATTEMPTS
CREATE TABLE user_exam_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    formation_id BIGINT NOT NULL,
    score INT,
    passed BOOLEAN DEFAULT FALSE,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_formations_route ON formations(route_id);
CREATE INDEX idx_modules_formation ON modules(formation_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_communities_route ON communities(route_id);
CREATE INDEX idx_communities_formation ON communities(formation_id);
CREATE INDEX idx_exam_questions_formation ON exam_questions(formation_id);
