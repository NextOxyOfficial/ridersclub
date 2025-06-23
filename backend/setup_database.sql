-- PostgreSQL Database Setup for Riders Club
-- Run this in your PostgreSQL command line or pgAdmin

-- Create the database
CREATE DATABASE ridersclub_db;

-- Create a user (optional - you can use your existing postgres user)
-- CREATE USER ridersclub_user WITH PASSWORD 'your_secure_password';

-- Grant privileges to the user
-- GRANT ALL PRIVILEGES ON DATABASE ridersclub_db TO ridersclub_user;

-- Connect to the database
\c ridersclub_db;

-- The Django migrations will create all necessary tables
-- No need to create tables manually
