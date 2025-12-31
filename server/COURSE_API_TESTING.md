# Course Catalog API Testing Guide

## Overview
This document describes how to test the Course Catalog backend functionalities that have been implemented.

## Prerequisites
1. MongoDB running on `mongodb://127.0.0.1:27017/Spiritus`
2. Node.js and npm installed
3. Server dependencies installed (`npm install` in server directory)

## Setup

### 1. Seed the Database with Mock Data
```bash
cd server
node seedCourses.js
```

This will populate the database with 11 sample courses covering various categories:
- Self-Discipline
- Yoga
- Mindfulness
- Communication
- Language
- Self-Confidence
- Emotional Intelligence
- Leadership
- Creativity
- Time Management
- Cognitive Performance

### 2. Start the Server
```bash
cd server
npm start
# or
npm run server
```

The server should start on port 4000 (default).

## API Endpoints

### 1. Get All Courses
**Endpoint:** `GET /api/courses`

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "mindfulness", "communication")
- `search` (optional): Search in title and description
- `level` (optional): Filter by difficulty level ("beginner", "intermediate", "advanced")
- `sort` (optional): Sort by "newest", "popular", "rating", or "duration"
- `limit` (optional): Limit number of results

**Examples:**
```bash
# Get all courses
curl http://localhost:4000/api/courses

# Get courses by category
curl http://localhost:4000/api/courses?category=mindfulness

# Search courses
curl http://localhost:4000/api/courses?search=meditation

# Filter by level
curl http://localhost:4000/api/courses?level=beginner

# Sort by rating
curl http://localhost:4000/api/courses?sort=rating

# Combine filters
curl http://localhost:4000/api/courses?category=communication&level=intermediate&sort=popular
```

**Response Format:**
```json
{
  "success": true,
  "courses": [
    {
      "_id": "...",
      "title": "Course Title",
      "description": "Course description",
      "category": "mindfulness",
      "level": "beginner",
      "duration": 90,
      "thumbnail": "https://...",
      "rating": 4.5,
      "totalEnrollments": 1250,
      "concepts": 8,
      "outcomes": ["Outcome 1", "Outcome 2"],
      "prerequisites": ["Prereq 1"],
      "modules": [],
      "isPublished": true,
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  ],
  "count": 11
}
```

### 2. Get Course Categories
**Endpoint:** `GET /api/courses/categories`

**Examples:**
```bash
curl http://localhost:4000/api/courses/categories
```

**Response Format:**
```json
{
  "success": true,
  "categories": [
    {
      "name": "Emotional Mastery",
      "value": "emotional-intelligence",
      "count": 1
    },
    {
      "name": "Visionary Leadership",
      "value": "leadership",
      "count": 1
    },
    ...
  ]
}
```

### 3. Get Course by ID
**Endpoint:** `GET /api/courses/:courseId`

**Examples:**
```bash
curl http://localhost:4000/api/courses/[COURSE_ID]
```

**Response Format:**
```json
{
  "success": true,
  "course": {
    "_id": "...",
    "title": "Course Title",
    "description": "Detailed description",
    "category": "mindfulness",
    "level": "beginner",
    "duration": 90,
    "thumbnail": "https://...",
    "rating": 4.5,
    "totalEnrollments": 1250,
    "concepts": 8,
    "outcomes": ["Outcome 1", "Outcome 2"],
    "prerequisites": ["Prereq 1"],
    "modules": [],
    "isPublished": true,
    "createdAt": "2024-...",
    "updatedAt": "2024-..."
  }
}
```

## Frontend Integration

The frontend (`CourseCatalog.jsx`) has been updated to consume these API endpoints:

1. **On Component Mount:**
   - Fetches categories from `/api/courses/categories`
   - Displays category filters dynamically

2. **When Filters Change:**
   - Fetches courses from `/api/courses` with appropriate query parameters
   - Updates the course list display

3. **Environment Configuration:**
   - Uses `VITE_BACKEND_URL` environment variable
   - Falls back to `http://localhost:4000` if not set

## Running Automated Tests

```bash
cd server
npm test
```

This will run the Mocha test suite including the new course API tests in `test/courses.test.js`.

## Manual Testing Checklist

### Basic Functionality
- [ ] GET /api/courses returns all published courses
- [ ] GET /api/courses/categories returns category list with counts
- [ ] GET /api/courses/:id returns specific course details

### Filtering
- [ ] Category filter works correctly
- [ ] Level filter works correctly
- [ ] Search filter works for title and description
- [ ] Multiple filters work together

### Sorting
- [ ] Sort by newest (default)
- [ ] Sort by popular (totalEnrollments descending)
- [ ] Sort by rating (rating descending)
- [ ] Sort by duration (duration ascending)

### Edge Cases
- [ ] No results found returns empty array
- [ ] Invalid course ID returns 404
- [ ] Only published courses are returned
- [ ] Limit parameter correctly limits results

### Frontend Integration
- [ ] Categories load dynamically on page load
- [ ] Courses display correctly with all fields
- [ ] Filters update course list
- [ ] Search functionality works
- [ ] Sort dropdown changes order
- [ ] Course preview modal shows correct data
- [ ] Navigate to course details works

## Mock Data Details

The seeded courses include:
1. Building Self-Discipline (self-discipline, beginner)
2. Yoga for Beginners (yoga, beginner)
3. Mindfulness Meditation (mindfulness, beginner)
4. Effective Communication Skills (communication, intermediate)
5. English Fluency for Beginners (language, beginner)
6. Building Unshakeable Self-Confidence (self-confidence, intermediate)
7. Mastering Emotional Intelligence (emotional-intelligence, intermediate)
8. Leadership Essentials (leadership, intermediate)
9. Creative Problem Solving (creativity, intermediate)
10. Time Management Mastery (time-management, intermediate)
11. Peak Mental Performance (cognitive-performance, advanced)

Each course includes:
- Title and description
- Category and level
- Duration (in minutes)
- Thumbnail URL
- Prerequisites and outcomes
- Concepts count
- Rating (4.4 - 4.9)
- Total enrollments (950 - 5800)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `pgrep mongod`
- Check connection string in `server.js` and `seedCourses.js`
- Verify MongoDB port (default: 27017)

### No Courses Returned
- Run seed script: `node seedCourses.js`
- Check database: `mongo Spiritus` then `db.courses.find()`
- Verify `isPublished: true` in database

### Frontend Not Connecting
- Check VITE_BACKEND_URL in frontend `.env` file
- Verify server is running on correct port
- Check CORS configuration in `server.js`
- Open browser console for error messages

## Next Steps

For production deployment:
1. Replace mock data with real course content
2. Add authentication for course enrollment
3. Implement progress tracking
4. Add course creation/editing for admins
5. Set up proper error logging
6. Add rate limiting and caching
