# Spiritus Backend

Backend API for the Spiritus application with admin course management functionality.

## Features
- User authentication and authorization
- Admin-only course management (CRUD operations)
- JWT-based authentication
- Role-based access control (user/admin)

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or accessible via connection string)

## Setup

1. Install dependencies:
```bash
npm run backend:install
```

2. Create a `.env` file in the `backend` directory with the following:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/spiritus

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_this_to_a_secure_random_string

# Server
PORT=4000
```

3. Create an admin user:
```bash
npm run seed:db
```

4. Start the backend server:
```bash
npm run backend
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get course by ID (public)
- `POST /api/courses/enroll` - Enroll in a course (authenticated users)

### Course Management (Admin Only)
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

## Admin Credentials
After running the seed script, an admin account will be created:
- Email: `admin@spiritus.com`
- Password: `admin123` (change this immediately in production)

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 4000)