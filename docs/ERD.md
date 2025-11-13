# Happy Tails — ERD

The project's Entity-Relationship Diagram (ERD) shows the main entities and relationships used by the application.

If you placed the ERD image into this repository, name it `docs/erd.png` so it is visible here.

Entities (summary):

- Shelter (shelter_id PK): name, location, contact_info
- Shelter_Staff (staff_id PK): shelter_id (FK), email, password
- Pet (pet_id PK): shelter_id (FK), name, species, status, description, breed, age, size, temperament, photos_json
- Adopter (adopter_id PK): email, password, profile_personal_info (JSON), profile_residence_details (JSON), profile_pet_experience (TEXT)
- Application (application_id PK): adopter_id (FK), pet_id (FK), status, supplementary_answers, submitted_at

Relationships:

- Shelter employs Shelter_Staff (1-to-many)
- Shelter houses Pet (1-to-many)
- Adopter submits Application for Pet (1-to-many -> Application)

Refer to the attached ERD image for a visual layout of attributes and keys.
