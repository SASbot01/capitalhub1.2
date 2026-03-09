-- V16: Tabla para pagos pendientes de registro
-- Cuando alguien paga en Stripe pero aún no se ha registrado,
-- se guarda aquí y se le envía un email con enlace de registro.

CREATE TABLE IF NOT EXISTS pending_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    tier VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    INDEX idx_pending_token (token),
    INDEX idx_pending_email (email),
    INDEX idx_pending_used (used)
);
