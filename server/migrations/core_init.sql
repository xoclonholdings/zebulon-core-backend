-- core_init.sql: Core schema and tables for Zebulon
-- TODO: Review and customize columns, constraints, and seed data as needed

CREATE SCHEMA IF NOT EXISTS core;

-- Users table

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS core.sessions CASCADE;
DROP TABLE IF EXISTS core.users CASCADE;
CREATE TABLE core.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE core.sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Permissions table
CREATE TABLE IF NOT EXISTS core.permissions (
    id SERIAL PRIMARY KEY,
    role VARCHAR(64) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    access VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: Add additional core tables and seed data as required by your application
