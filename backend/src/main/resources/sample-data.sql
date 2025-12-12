-- HappyTails Sample Data for Testing
-- Run this script after the application has created the tables

-- ========================================
-- 1. SAMPLE SHELTERS
-- ========================================

INSERT INTO shelter (name, location, contact_info) VALUES
('Happy Paws Shelter', 'Cebu City, Philippines', 'contact@happypaws.com, +63-917-123-4567'),
('Cebu Animal Rescue', 'Mandaue City, Cebu', 'info@ceburescue.org, +63-918-234-5678'),
('Pet Haven Cebu', 'Lapu-Lapu City, Cebu', 'hello@pethavencebu.com, +63-919-345-6789'),
('Guardian Angels Pet Sanctuary', 'Talisay City, Cebu', 'guardians@petangels.ph, +63-920-456-7890'),
('Hope for Paws Cebu', 'Consolacion, Cebu', 'hope@pawscebu.org, +63-921-567-8901');

-- ========================================
-- 2. SAMPLE SHELTER STAFF
-- ========================================
-- Password for all staff: Staff123!
-- BCrypt hash: $2a$10$YourHashHere (you need to generate this)

INSERT INTO shelter_staff (shelter_id, email, password, created_at, updated_at) VALUES
(1, 'staff1@happypaws.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'staff2@ceburescue.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'staff3@pethavencebu.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========================================
-- 3. SAMPLE ADOPTERS
-- ========================================
-- Password for all adopters: Test123!
-- BCrypt hash: $2a$10$YourHashHere

INSERT INTO adopter (email, password, profile_personal_info, profile_residence_details, profile_pet_experience, created_at, updated_at) VALUES
('john.doe@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', 
 'John Doe, 30 years old, works as software engineer', 
 'Own house with fenced yard in Cebu City, living with spouse', 
 'Had golden retriever for 8 years, experience with training and care',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('maria.santos@yahoo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO',
 'Maria Santos, 25 years old, teacher',
 'Apartment with pet-friendly policy in Mandaue City',
 'Grew up with cats, first time adopting on my own',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('carlos.reyes@outlook.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO',
 'Carlos Reyes, 35 years old, business owner',
 'House with large backyard in Lapu-Lapu City, family of 4',
 'Had multiple dogs and cats over the years, experienced with veterinary care',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========================================
-- 4. SAMPLE PETS
-- ========================================

INSERT INTO pet (shelter_id, name, species, breed, age, size, gender, status, description, temperament, photos_json) VALUES
-- Happy Paws Shelter Pets
(1, 'Luna', 'Dog', 'Golden Retriever', '2 years', 'Large', 'Female', 'Available',
 'Luna is a friendly and energetic golden retriever who loves to play fetch and go on walks. She is great with children and other dogs.',
 'Friendly, Playful, Energetic',
 '["/uploads/pet1.jpg"]'),

(1, 'Max', 'Dog', 'Beagle', '3 years', 'Medium', 'Male', 'Available',
 'Max is a curious and friendly beagle who loves to explore. He is well-trained and gets along with other pets.',
 'Curious, Friendly, Gentle',
 '["/uploads/pet2.jpg"]'),

(1, 'Whiskers', 'Cat', 'Tabby Mix', '1 year', 'Small', 'Male', 'Available',
 'Whiskers is a playful young cat who loves to chase toys and take naps in sunny spots. He is independent but affectionate.',
 'Playful, Independent, Affectionate',
 '["/uploads/pet3.jpg"]'),

-- Cebu Animal Rescue Pets
(2, 'Bella', 'Dog', 'French Bulldog', '4 years', 'Small', 'Female', 'Available',
 'Bella is a sweet and affectionate French Bulldog who loves to cuddle and be around people. Perfect for apartment living.',
 'Affectionate, Calm, Loyal',
 '["/uploads/pet4.jpg"]'),

(2, 'Charlie', 'Dog', 'Labrador Mix', '5 years', 'Large', 'Male', 'Available',
 'Charlie is a loyal and calm companion who enjoys leisurely walks and relaxing at home. Great for families.',
 'Loyal, Calm, Gentle',
 '["/uploads/pet5.jpg"]'),

(2, 'Mittens', 'Cat', 'Siamese', '2 years', 'Medium', 'Female', 'Available',
 'Mittens is a vocal and social Siamese cat who loves attention and conversation. She is very intelligent and trainable.',
 'Vocal, Social, Intelligent',
 '["/uploads/pet6.jpg"]'),

-- Pet Haven Cebu Pets
(3, 'Rocky', 'Dog', 'German Shepherd', '3 years', 'Large', 'Male', 'Available',
 'Rocky is a protective and intelligent German Shepherd who makes an excellent guard dog. He is loyal and trainable.',
 'Protective, Intelligent, Loyal',
 '["/uploads/pet7.jpg"]'),

(3, 'Daisy', 'Dog', 'Poodle Mix', '2 years', 'Small', 'Female', 'Available',
 'Daisy is a cheerful and energetic small dog who loves to play and be the center of attention. Great with kids.',
 'Cheerful, Energetic, Playful',
 '["/uploads/pet8.jpg"]'),

(3, 'Shadow', 'Cat', 'Black Domestic Shorthair', '3 years', 'Medium', 'Male', 'Available',
 'Shadow is a mysterious and independent black cat who enjoys quiet environments. He is affectionate once he trusts you.',
 'Independent, Calm, Mysterious',
 '["/uploads/pet1.jpg"]'),

-- Guardian Angels Pets
(4, 'Buddy', 'Dog', 'Mixed Breed', '6 years', 'Medium', 'Male', 'Available',
 'Buddy is a senior dog with a heart of gold. He is calm, well-behaved, and looking for a quiet home to spend his golden years.',
 'Calm, Gentle, Sweet',
 '["/uploads/pet2.jpg"]'),

(4, 'Coco', 'Rabbit', 'Lop-Eared', '1 year', 'Small', 'Female', 'Available',
 'Coco is a gentle and quiet rabbit who loves fresh vegetables and hopping around in a safe space. Perfect for calm households.',
 'Gentle, Quiet, Sweet',
 '["/uploads/pet3.jpg"]'),

-- Hope for Paws Cebu Pets
(5, 'Tweety', 'Bird', 'Canary', '1 year', 'Small', 'Male', 'Available',
 'Tweety is a cheerful canary with a beautiful singing voice. He brings joy and music to any home.',
 'Cheerful, Active, Musical',
 '["/uploads/pet4.jpg"]'),

(5, 'Sassy', 'Cat', 'Persian', '4 years', 'Medium', 'Female', 'Available',
 'Sassy is a beautiful Persian cat who enjoys grooming and pampering. She is calm and prefers a quiet environment.',
 'Calm, Reserved, Elegant',
 '["/uploads/pet5.jpg"]');

-- ========================================
-- 5. SAMPLE APPLICATIONS
-- ========================================

INSERT INTO application (adopter_id, pet_id, status, supplementary_answers, submitted_at) VALUES
-- John Doe applying for Luna
(1, 1, 'In_Review', 
 'I have experience with large dogs and a secure fenced yard. I work from home so Luna will have plenty of company and attention.',
 CURRENT_TIMESTAMP),

-- Maria Santos applying for Whiskers
(2, 3, 'Received',
 'My apartment is pet-friendly and I have experience with cats. I can provide a loving home with plenty of toys and attention.',
 CURRENT_TIMESTAMP),

-- Carlos Reyes applying for Max
(3, 2, 'Interview_Scheduled',
 'We are a family of 4 with two children who love animals. We have a large backyard and experience with beagles.',
 CURRENT_TIMESTAMP);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Uncomment to verify data insertion:

-- SELECT COUNT(*) as shelter_count FROM shelter;
-- SELECT COUNT(*) as staff_count FROM shelter_staff;
-- SELECT COUNT(*) as adopter_count FROM adopter;
-- SELECT COUNT(*) as pet_count FROM pet;
-- SELECT COUNT(*) as application_count FROM application;

-- ========================================
-- NOTES
-- ========================================
-- 1. Default passwords:
--    - Staff: Staff123!
--    - Adopters: Test123!
--
-- 2. To generate BCrypt passwords:
--    Use: https://bcrypt-generator.com/
--    Or: Register via API and check database
--
-- 3. Photo URLs use local default images from /backend/uploads/
--    Replace with actual uploaded photos when adding new pets
--
-- 4. All timestamps use CURRENT_TIMESTAMP
--    Adjust if needed for testing time-based features
