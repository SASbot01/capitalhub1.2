-- =====================================================
-- V17: Level 1 Access System
-- Sistema de monedas, desbloqueo progresivo, ruta activa, trial gratuito
-- =====================================================

-- 1. user_active_routes: Ruta activa del usuario (1 por usuario)
CREATE TABLE IF NOT EXISTS user_active_routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    route_id BIGINT NOT NULL,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- 2. user_formation_unlocks: Formaciones desbloqueadas (persisten tras cancelación)
CREATE TABLE IF NOT EXISTS user_formation_unlocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    formation_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    unlock_type VARCHAR(20) NOT NULL COMMENT 'FIRST_PAYMENT, COIN_SPENT, TRIAL',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_formation (user_id, formation_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (formation_id) REFERENCES formations(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- 3. coin_transactions: Log de monedas
CREATE TABLE IF NOT EXISTS coin_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount INT NOT NULL COMMENT '+1 grant, -1 spend',
    transaction_type VARCHAR(30) NOT NULL COMMENT 'MONTHLY_GRANT, FIRST_PAYMENT_BONUS, COIN_SPENT',
    reference_id BIGINT NULL COMMENT 'formation_id when spending',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Alteraciones a users: campos de trial y monedas
ALTER TABLE users ADD COLUMN coin_balance INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN trial_started_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN trial_formation_id BIGINT NULL;
ALTER TABLE users ADD COLUMN trial_route_id BIGINT NULL;
ALTER TABLE users ADD COLUMN has_cancelled_before BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN cancelled_at TIMESTAMP NULL;

-- 5. Alteración a modules: content_type
ALTER TABLE modules ADD COLUMN content_type VARCHAR(20) NOT NULL DEFAULT 'TECHNICAL';

-- 6. T0 precio → €0 (handled in Java enum, but update any DB records)
-- This is an enum change in code, no DB migration needed for the tier itself.
-- Update existing T0 users to reflect free trial if needed:
UPDATE users SET subscription_tier = 'T0' WHERE subscription_tier = 'T0';
