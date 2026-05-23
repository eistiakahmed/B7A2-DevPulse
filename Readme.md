#  Project Name: DevPulse

**Live URL:** [https://b7a2-devpulse-dpci.onrender.com](https://b7a2-devpulse-dpci.onrender.com)

A robust backend API for tracking internal technical issues and feature requests within development teams. Built with TypeScript, Express.js, and PostgreSQL, DevPulse provides a streamlined solution for managing and collaborating on software development tasks.

## Features

### Core Functionality
- **User Authentication & Authorization**
  - Secure user registration with role-based access control
  - JWT-based authentication system
  - Role management: Contributors and Maintainers
  - Password encryption using bcrypt

- **Issue Management**
  - Create bug reports and feature requests
  - Update issues with status tracking (open, in_progress, resolved)
  - Delete issues (maintainer-only)
  - Filter issues by type and status
  - Sort issues by creation date (newest/oldest)

- **Access Control**
  - Contributors can create and update their own open issues
  - Maintainers have full access to modify any issue
  - Only maintainers can delete issues

- **Query & Filtering**
  - Advanced query parameters for issue filtering
  - Support for type filtering (bug/feature_request)
  - Status filtering (open/in_progress/resolved)
  - Flexible sorting options

## Tech Stack

### Backend Framework
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript

### Database
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Authentication & Security
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation and validation
- **cors** - Cross-Origin Resource Sharing

### Development Tools
- **tsx** - TypeScript execution engine
- **dotenv** - Environment variable management
- **TypeScript 5.8** - Static typing

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "contributor"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2024-05-23T10:30:00.000Z",
    "updated_at": "2024-05-23T10:30:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor",
      "created_at": "2024-05-23T10:30:00.000Z",
      "updated_at": "2024-05-23T10:30:00.000Z"
    }
  }
}
```

### Issue Routes

#### POST `/api/issues`
Create a new issue (requires authentication).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "Users are unable to login when using special characters in passwords",
  "type": "bug"
}
```

**Response (201 Created):**
```json
{
  "message": "Issue created successfully",
  "data": {
    "id": 1,
    "title": "Fix login bug",
    "description": "Users are unable to login when using special characters in passwords",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2024-05-23T10:35:00.000Z",
    "updated_at": "2024-05-23T10:35:00.000Z"
  }
}
```

#### GET `/api/issues`
Retrieve all issues with optional filtering (public endpoint).

**Query Parameters:**
- `type` - Filter by issue type (`bug` | `feature_request`)
- `status` - Filter by status (`open` | `in_progress` | `resolved`)
- `sort` - Sort order (`newest` | `oldest`, default: `newest`)

**Example:** `GET /api/issues?type=bug&status=open&sort=newest`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Fix login bug",
      "description": "Users are unable to login when using special characters in passwords",
      "type": "bug",
      "status": "open",
      "reporter_id": 1,
      "created_at": "2024-05-23T10:35:00.000Z",
      "updated_at": "2024-05-23T10:35:00.000Z",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      }
    }
  ]
}
```

#### GET `/api/issues/:id`
Retrieve a specific issue by ID (public endpoint).

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "title": "Fix login bug",
    "description": "Users are unable to login when using special characters in passwords",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2024-05-23T10:35:00.000Z",
    "updated_at": "2024-05-23T10:35:00.000Z",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    }
  }
}
```

#### PATCH `/api/issues/:id`
Update an existing issue (requires authentication).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Fix login authentication bug",
  "status": "in_progress"
}
```

**Response (200 OK):**
```json
{
  "message": "Issue updated successfully",
  "data": {
    "id": 1,
    "title": "Fix login authentication bug",
    "description": "Users are unable to login when using special characters in passwords",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1,
    "created_at": "2024-05-23T10:35:00.000Z",
    "updated_at": "2024-05-23T10:40:00.000Z"
  }
}
```

#### DELETE `/api/issues/:id`
Delete an issue (requires maintainer role).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Issue deleted successfully"
}
```

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'contributor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Issues Table
```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DevPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/devpulse
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Setup PostgreSQL database**
   
   Create a new database:
   ```bash
   psql -U postgres
   CREATE DATABASE devpulse;
   \q
   ```

5. **Initialize database tables**
   
   Run the following SQL commands in your PostgreSQL interface:
   ```sql
   -- Users Table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL DEFAULT 'contributor',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Issues Table
   CREATE TABLE issues (
     id SERIAL PRIMARY KEY,
     title VARCHAR(150) NOT NULL,
     description TEXT NOT NULL,
     type VARCHAR(20) NOT NULL,
     status VARCHAR(20) DEFAULT 'open',
     reporter_id INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (reporter_id) REFERENCES users(id)
   );
   ```

6. **Build the project**
   ```bash
   npm run build
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

8. **Verify the setup**
   
   The server should start on the configured port (default 3000):
   ```
   Server is running on port 3000
   Environment: development
   ```

## Security Features

- **Password Encryption**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Role-Based Access Control**: Two-tier permission system (Contributor/Maintainer)
- **Input Validation**: Comprehensive validation for all API endpoints
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with appropriate HTTP status codes

## Project Structure

```
DevPulse/
├── src/
│   ├── config/         
│   ├── controllers/    
│   ├── middleware/     
│   ├── models/         
│   ├── routes/         
│   ├── services/       
│   ├── types/          
│   ├── utils/          
│   └── server.ts       
├── .env.example        
├── package.json        
├── tsconfig.json       
└── README.md           
```
