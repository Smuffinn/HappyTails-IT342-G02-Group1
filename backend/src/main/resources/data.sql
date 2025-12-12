-- Sample data for HappyTails (PostgreSQL syntax)
-- This runs automatically on first startup if tables are empty

-- Only insert if no shelters exist
INSERT INTO shelter (name, location, contact_info)
SELECT 'Cebu City Pound', 'Cebu City, Philippines', '09123456789'
WHERE NOT EXISTS (SELECT 1 FROM shelter WHERE name = 'Cebu City Pound');

INSERT INTO shelter (name, location, contact_info)
SELECT 'Happy Paws Shelter', 'Mandaue City, Cebu', '09123456790'
WHERE NOT EXISTS (SELECT 1 FROM shelter WHERE name = 'Happy Paws Shelter');

INSERT INTO shelter (name, location, contact_info)
SELECT 'Pet Haven Cebu', 'Lapu-Lapu City, Cebu', '09123456791'
WHERE NOT EXISTS (SELECT 1 FROM shelter WHERE name = 'Pet Haven Cebu');
