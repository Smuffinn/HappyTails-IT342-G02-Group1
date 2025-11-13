# HappyTails-IT342-G02-Group1

## Project Title & Short Description
**HappyTails** - A web and mobile platform designed to create positive outcomes in the pet adoption process by connecting animal shelters with potential adopters through a centralized, user-friendly interface. The system simplifies the search for a new pet using detailed animal profiles, advanced filtering, and a clear application workflow to increase visibility for shelter animals and boost adoption rates.

## Tech Stack Used
### Backend
- Java 17
- Spring Boot 3.5.7
- Spring Data JPA
- Spring Security
- JWT (JSON Web Tokens) for authentication
- Maven
- Lombok

### Web
- React 19.2.0
- React Router DOM 7.9.5
- Vite 7.2.2
- TailwindCSS 3.4.18
- Axios 1.13.2

### Mobile
- Android (Kotlin/Java) - Coming Soon

### Database
- MySQL

## Setup & Run Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Smuffinn/HappyTails-IT342-G02-Group1.git
   cd HappyTails-IT342-G02-Group1/backend
   ```

2. **Configure MySQL Database**
   - Create a MySQL database:
     ```sql
     CREATE DATABASE happytails_db;
     ```
   - Update `backend/src/main/resources/application.properties` with your MySQL credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/happytails_db
     spring.datasource.username=YOUR_MYSQL_USERNAME
     spring.datasource.password=YOUR_MYSQL_PASSWORD
     ```

3. **Install Dependencies**
   ```bash
   mvn clean install
   ```

4. **Run the Backend**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Web Setup

1. **Navigate to the web directory**
   ```bash
   cd ../web
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The web app will start on `http://localhost:5173` or `http://localhost:5174`

4. **Build for Production**
   ```bash
   npm run build
   ```

### Mobile
Coming Soon

## Features
- 🔐 **User Authentication** - Secure JWT-based authentication for adopters and shelter staff
- 🐾 **Pet Discovery** - Browse available pets with detailed profiles and photos
- 🔍 **Advanced Filtering** - Filter pets by species, size, age, and traits
- 📝 **Adoption Applications** - Submit and manage adoption applications
- 👤 **User Profiles** - Manage adopter and shelter staff profiles
- 🏠 **Shelter Management** - Shelter staff can manage pets and applications

## API Endpoints
### Authentication
- `POST /api/auth/register-adopter` - Register new adopter
- `POST /api/auth/register-staff` - Register shelter staff
- `POST /api/auth/login` - Login

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `POST /api/pets` - Create new pet (Staff only)
- `PUT /api/pets/{id}` - Update pet (Staff only)
- `DELETE /api/pets/{id}` - Delete pet (Staff only)

### Adopters
- `GET /api/adopters/me` - Get current adopter profile
- `PUT /api/adopters/me` - Update current adopter profile

### Applications
- `POST /api/applications` - Submit adoption application
- `GET /api/applications` - Get all applications (Staff only)
- `PUT /api/applications/{id}/status` - Update application status (Staff only)


## Team Members
| Name | Role | CIT-U Email | GitHub |
|------|------|-------------|--------|
| Gwyn M. Sapio | Frontend Developer | gwyn.sapio@cit.edu | pengwyn7 |
| Jeric Kiel B. Melocoton | Mobile Developer | jerickiel.melocoton@cit.edu | Jeric Melocoton |
| Louis Drey F. Castaneto | Frontend Developer | louisdrey.castaneto@cit.edu | louis |
| Steven Jan M. Tabungar | Backend Developer | stevenjan.tabungar@cit.edu | Smuffinn |

## Deployed Link
Not yet deployed
