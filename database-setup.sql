-- HappyTails Database Setup Script for MySQL Workbench
-- Run this script to create the database and tables

-- ===================================================================
-- CREATE DATABASE
-- ===================================================================
CREATE DATABASE IF NOT EXISTS happytails_db;
USE happytails_db;

-- ===================================================================
-- CREATE TABLES (Based on JPA Entities)
-- ===================================================================

-- Shelter Table
CREATE TABLE IF NOT EXISTS shelter (
  shelter_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shelter Staff Table
CREATE TABLE IF NOT EXISTS shelter_staff (
  staff_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  shelter_id BIGINT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (shelter_id) REFERENCES shelter(shelter_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adopter Table
CREATE TABLE IF NOT EXISTS adopter (
  adopter_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_personal_info TEXT,
  profile_residence_details TEXT,
  profile_pet_experience TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pet Table
CREATE TABLE IF NOT EXISTS pet (
  pet_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  shelter_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  age INT,
  size VARCHAR(50),
  temperament VARCHAR(255),
  adoption_status VARCHAR(50) DEFAULT 'Available',
  photos_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (shelter_id) REFERENCES shelter(shelter_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Application Table
CREATE TABLE IF NOT EXISTS application (
  application_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  adopter_id BIGINT NOT NULL,
  pet_id BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'Received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (adopter_id) REFERENCES adopter(adopter_id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- INSERT SAMPLE SHELTERS (3 shelters)
-- ===================================================================
INSERT INTO shelter (name, location, contact_info) VALUES
('Cebu City Pound', 'Cebu City, Philippines', '{"phone": "123-456-7890", "email": "info@cebupound.org"}'),
('Happy Paws Shelter', 'Mandaue City, Cebu', '{"phone": "123-456-7891", "email": "contact@happypaws.com"}'),
('Pet Haven Cebu', 'Lapu-Lapu City, Cebu', '{"phone": "123-456-7892", "email": "hello@pethavencebu.com"}');

-- ===================================================================
-- Verify Insert
-- ===================================================================
SELECT * FROM shelter;
