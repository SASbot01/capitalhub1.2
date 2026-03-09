-- V15__Seed_Test_Accounts_All_Roles_And_Tiers.sql
-- Cuentas de prueba para cada ROL × PLAN para verificar configuración
-- Password para TODAS las cuentas: test123
-- Hash bcrypt: $2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq

-- ============================================================
-- 1. CUENTAS REP (Comerciales) - Una por cada tier + una sin plan
-- ============================================================

-- REP sin suscripción (free)
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES ('rep.free@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Rep', 'Free', 'REP', TRUE);

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES ((SELECT id FROM users WHERE email = 'rep.free@test.com'), 'SETTER', 'Comercial sin suscripción - cuenta de prueba', 'España', '+34 600 000 001', TRUE, NOW());

-- REP con T0 (Trial - 8€, 14 días)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at)
VALUES ('rep.t0@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Rep', 'Trial', 'REP', TRUE, 'T0', DATE_ADD(NOW(), INTERVAL 14 DAY));

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES ((SELECT id FROM users WHERE email = 'rep.t0@test.com'), 'SETTER', 'Comercial con plan Trial - cuenta de prueba', 'España', '+34 600 000 002', TRUE, NOW());

-- REP con T1 (Basic - 44€/mes)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at)
VALUES ('rep.t1@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Rep', 'Basic', 'REP', TRUE, 'T1', DATE_ADD(NOW(), INTERVAL 30 DAY));

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES ((SELECT id FROM users WHERE email = 'rep.t1@test.com'), 'CLOSER', 'Comercial con plan Basic - cuenta de prueba', 'España', '+34 600 000 003', TRUE, NOW());

-- REP con T2 (Bootcamp - 1.900€, 12 meses)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at, bootcamp_start_date, marketplace_visible)
VALUES ('rep.t2@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Rep', 'Bootcamp', 'REP', TRUE, 'T2', DATE_ADD(NOW(), INTERVAL 365 DAY), NOW(), TRUE);

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES ((SELECT id FROM users WHERE email = 'rep.t2@test.com'), 'CLOSER', 'Comercial con plan Bootcamp - cuenta de prueba', 'España', '+34 600 000 004', TRUE, NOW());

-- REP con T3 (Pro - 97€/mes, post-bootcamp)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at, has_certification, marketplace_visible)
VALUES ('rep.t3@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Rep', 'Pro', 'REP', TRUE, 'T3', DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, TRUE);

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES ((SELECT id FROM users WHERE email = 'rep.t3@test.com'), 'BOTH', 'Comercial con plan Pro certificado - cuenta de prueba', 'España', '+34 600 000 005', TRUE, NOW());

-- REP con T4 (Enterprise - 3.000€, 12 meses)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at, has_certification, marketplace_visible)
VALUES ('rep.t4@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Rep', 'Enterprise', 'REP', TRUE, 'T4', DATE_ADD(NOW(), INTERVAL 365 DAY), TRUE, TRUE);

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES ((SELECT id FROM users WHERE email = 'rep.t4@test.com'), 'BOTH', 'Comercial con plan Enterprise - cuenta de prueba', 'España', '+34 600 000 006', TRUE, NOW());


-- ============================================================
-- 2. CUENTAS COMPANY (Empresas) - Una por cada tier + una sin plan
-- ============================================================

-- COMPANY sin suscripción (free)
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES ('company.free@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Company', 'Free', 'COMPANY', TRUE);

INSERT INTO companies (user_id, name, industry, website, about)
VALUES ((SELECT id FROM users WHERE email = 'company.free@test.com'), 'Empresa Free Test', 'Marketing', 'https://empresa-free.test', 'Empresa sin suscripción - cuenta de prueba');

-- COMPANY con T0 (Trial)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at)
VALUES ('company.t0@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Company', 'Trial', 'COMPANY', TRUE, 'T0', DATE_ADD(NOW(), INTERVAL 14 DAY));

INSERT INTO companies (user_id, name, industry, website, about)
VALUES ((SELECT id FROM users WHERE email = 'company.t0@test.com'), 'Empresa Trial Test', 'Consultoría', 'https://empresa-trial.test', 'Empresa con plan Trial - cuenta de prueba');

-- COMPANY con T1 (Basic)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at)
VALUES ('company.t1@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Company', 'Basic', 'COMPANY', TRUE, 'T1', DATE_ADD(NOW(), INTERVAL 30 DAY));

INSERT INTO companies (user_id, name, industry, website, about)
VALUES ((SELECT id FROM users WHERE email = 'company.t1@test.com'), 'Empresa Basic Test', 'E-commerce', 'https://empresa-basic.test', 'Empresa con plan Basic - cuenta de prueba');

-- COMPANY con T2 (Bootcamp)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at, bootcamp_start_date, marketplace_visible)
VALUES ('company.t2@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Company', 'Bootcamp', 'COMPANY', TRUE, 'T2', DATE_ADD(NOW(), INTERVAL 365 DAY), NOW(), TRUE);

INSERT INTO companies (user_id, name, industry, website, about)
VALUES ((SELECT id FROM users WHERE email = 'company.t2@test.com'), 'Empresa Bootcamp Test', 'Coaching', 'https://empresa-bootcamp.test', 'Empresa con plan Bootcamp - cuenta de prueba');

-- COMPANY con T3 (Pro)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at, has_certification, marketplace_visible)
VALUES ('company.t3@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Company', 'Pro', 'COMPANY', TRUE, 'T3', DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, TRUE);

INSERT INTO companies (user_id, name, industry, website, about)
VALUES ((SELECT id FROM users WHERE email = 'company.t3@test.com'), 'Empresa Pro Test', 'Tecnología', 'https://empresa-pro.test', 'Empresa con plan Pro - cuenta de prueba');

-- COMPANY con T4 (Enterprise)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at, has_certification, marketplace_visible)
VALUES ('company.t4@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Company', 'Enterprise', 'COMPANY', TRUE, 'T4', DATE_ADD(NOW(), INTERVAL 365 DAY), TRUE, TRUE);

INSERT INTO companies (user_id, name, industry, website, about)
VALUES ((SELECT id FROM users WHERE email = 'company.t4@test.com'), 'Empresa Enterprise Test', 'Servicios Empresariales', 'https://empresa-enterprise.test', 'Empresa con plan Enterprise - cuenta de prueba');


-- ============================================================
-- 3. CUENTA ADMIN
-- ============================================================

-- ADMIN de prueba (con acceso completo T4)
INSERT INTO users (email, password, first_name, last_name, role, is_active, subscription_tier, tier_expires_at)
VALUES ('admin.test@test.com', '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', 'Admin', 'Test', 'ADMIN', TRUE, 'T4', DATE_ADD(NOW(), INTERVAL 365 DAY));


-- ============================================================
-- 4. HISTORIAL DE SUSCRIPCIÓN (para auditoría)
-- ============================================================

-- Registrar activación de suscripción para cada cuenta con tier
INSERT INTO subscription_history (user_id, previous_tier, new_tier, change_reason, payment_provider, amount_paid, created_at)
SELECT id, NULL, subscription_tier, 'SEED_TEST_ACCOUNT', 'manual',
    CASE subscription_tier
        WHEN 'T0' THEN 8.00
        WHEN 'T1' THEN 44.00
        WHEN 'T2' THEN 1900.00
        WHEN 'T3' THEN 97.00
        WHEN 'T4' THEN 3000.00
    END,
    NOW()
FROM users
WHERE email LIKE '%@test.com' AND subscription_tier IS NOT NULL;
