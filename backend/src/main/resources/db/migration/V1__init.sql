-- 1. TABLA DE USUARIOS (Simplificada)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(80),
    last_name VARCHAR(80),
    role VARCHAR(50) NOT NULL, -- CAMBIO: Guardamos 'COMPANY', 'REP', 'ADMIN' directamente
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. EMPRESAS
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    about TEXT,
    video_offer_url TEXT,
    projection_mrr INT DEFAULT 0,
    projection_growth INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. PERFILES REP
CREATE TABLE rep_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    role_type VARCHAR(40),
    bio TEXT,
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    country VARCHAR(100),
    languages VARCHAR(255),
    phone VARCHAR(50),
    city VARCHAR(100),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    avatar_url VARCHAR(255),
    intro_video_url TEXT,
    best_call_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rep_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. OFERTAS (JOB OFFERS)
CREATE TABLE job_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    role VARCHAR(40),
    seats INT DEFAULT 1,
    max_applicants INT DEFAULT 40,
    applicants_count INT DEFAULT 0,
    salary DECIMAL(10,2),
    commission_percent DECIMAL(5,2),
    avg_ticket DECIMAL(10,2),
    estimated_monthly_earnings DECIMAL(10,2),
    language VARCHAR(100),
    crm VARCHAR(100),
    modality VARCHAR(50),
    market VARCHAR(50),
    calendly_url VARCHAR(255),
    zoom_url VARCHAR(255),
    whatsapp_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 5. APLICACIONES
CREATE TABLE job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_offer_id BIGINT NOT NULL,
    rep_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'APPLIED',
    rep_message TEXT,
    company_notes TEXT,
    interview_url VARCHAR(255),
    interview_at TIMESTAMP NULL,
    hired_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_job FOREIGN KEY (job_offer_id) REFERENCES job_offers(id),
    CONSTRAINT fk_app_rep FOREIGN KEY (rep_id) REFERENCES rep_profiles(id)
);

-- 6. REVIEWS
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    rep_id BIGINT NOT NULL,
    job_offer_id BIGINT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    calls_made INT,
    deals_closed INT,
    generated_revenue DECIMAL(15,2),
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_review_rep FOREIGN KEY (rep_id) REFERENCES rep_profiles(id),
    CONSTRAINT fk_review_job FOREIGN KEY (job_offer_id) REFERENCES job_offers(id)
);

-- 7. CATÁLOGOS
CREATE TABLE industries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE languages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE crm_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 8. TRAINING
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200),
    content TEXT,
    video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lesson_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE user_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);