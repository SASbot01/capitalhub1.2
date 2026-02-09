-- V14__Add_Subscription_Tier_System.sql
-- Subscription Tier System for FPD Value Ladder

-- Add subscription fields to users table
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN has_certification BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN bootcamp_start_date TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN marketplace_visible BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN tier_expires_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255) NULL;

-- Create subscription history table
CREATE TABLE subscription_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    previous_tier VARCHAR(20) NULL,
    new_tier VARCHAR(20) NULL,
    change_reason VARCHAR(100) NOT NULL,
    payment_provider VARCHAR(50) NULL,
    payment_reference VARCHAR(255) NULL,
    amount_paid DECIMAL(10, 2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscription_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_subscription_history_user (user_id),
    INDEX idx_subscription_history_created (created_at)
);

-- Create payment events table for webhook logging
CREATE TABLE payment_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_id VARCHAR(255) NOT NULL,
    payload JSON NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_events_provider (provider),
    INDEX idx_payment_events_event_id (event_id),
    INDEX idx_payment_events_processed (processed),
    INDEX idx_payment_events_created (created_at)
);

-- Add tier restrictions to formations table
ALTER TABLE formations ADD COLUMN min_tier VARCHAR(20) DEFAULT 'T1';
ALTER TABLE formations ADD COLUMN is_intro_module BOOLEAN DEFAULT FALSE;

-- Create index for faster tier-based queries
CREATE INDEX idx_formations_min_tier ON formations(min_tier);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_marketplace_visible ON users(marketplace_visible);
