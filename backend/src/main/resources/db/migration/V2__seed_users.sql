-- USUARIO ADMIN
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES (
    'admin@capitalhub.com',
    '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', -- pass: test123
    'Super',
    'Admin',
    'ADMIN',
    TRUE
);

-- USUARIO COMPANY (Este es el que usaremos para entrar)
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES (
    'demo@company.com',
    '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', -- pass: test123
    'Demo',
    'Company',
    'COMPANY',
    TRUE
);

-- PERFIL DE EMPRESA
INSERT INTO companies (user_id, name, industry, website, about)
VALUES (
    (SELECT id FROM users WHERE email = 'demo@company.com'),
    'CapitalHub Demo',
    'Technology',
    'https://capitalhub.com',
    'Empresa de prueba para el MVP.'
);