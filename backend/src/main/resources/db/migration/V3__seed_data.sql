-- 1. Crear un COMERCIAL de prueba
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES (
    'rep@demo.com',
    '$2a$10$BYc/ZeOT2MP8z0Kvfn8HzeSr5Jh01beeG0JBNGZ2YVRkKblt0niBq', -- pass: test123
    'Juan',
    'Vendedor',
    'REP',
    TRUE
);

INSERT INTO rep_profiles (user_id, role_type, bio, country, phone, active, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'rep@demo.com'),
    'CLOSER',
    'Closer con experiencia en High Ticket.',
    'España',
    '+34 600 000 000',
    TRUE,
    NOW()
);

-- 2. Crear una OFERTA DE TRABAJO (de la empresa Demo creada en V2)
INSERT INTO job_offers (
    company_id, title, description, role, seats, max_applicants,
    salary, commission_percent, avg_ticket, estimated_monthly_earnings,
    language, crm, modality, market, calendly_url, status, active, applicants_count, created_at
) VALUES (
    -- CORRECCIÓN AQUÍ: Usamos 'CapitalHub Demo' que es el nombre real en V2
    (SELECT id FROM companies WHERE name = 'CapitalHub Demo' LIMIT 1),
    'Closer High Ticket para Lanzamiento',
    'Buscamos closer para cierre de ventas telefónicas.',
    'CLOSER', 2, 50, 1000.00, 10.0, 2500.00, 3000.00,
    'Español', 'HubSpot', 'Remoto', 'Latam', 'https://calendly.com', 'ACTIVE', TRUE, 0, NOW()
);