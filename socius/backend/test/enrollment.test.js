const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Helper function to decode JWT without verification (for testing)
function decodeToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }
  const payload = parts[1];
  const decodedPayload = Buffer.from(payload, 'base64').toString();
  return JSON.parse(decodedPayload);
}

describe('Course Enrollment Tests', () => {
  let userToken;
  let adminToken;
  let courseId;

  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout for database operations
    
    // Connect to a test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spiritus_test', {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    
    // Clear collections
    await User.deleteMany({});
    await Course.deleteMany({});
    
    // Create test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await user.save();
    
    // Create test admin
    const admin = new User({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();
    
    // Create test course
    const course = new Course({
      _id: 'test-course-1',
      title: 'Test Course',
      description: 'A test course',
      category: 'Spiritual Development',
      level: 'Beginner',
      duration: 120,
      instructor: 'Test Instructor',
      outcomes: ['Test outcome']
    });
    await course.save();
    courseId = course._id;
    
    // Generate tokens - follow the same structure as in the auth middleware
    userToken = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET || 'test-secret');
    adminToken = jwt.sign({ user: { id: admin.id, role: admin.role } }, process.env.JWT_SECRET || 'test-secret');
  }, 30000);

  afterAll(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
    await mongoose.connection.close();
  }, 10000);

  test('should successfully enroll a user in a course', async () => {
    const response = await request(app)
      .post('/api/courses/enroll')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ courseId })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Successfully enrolled in course');
  });

  test('should prevent duplicate enrollment for the same user', async () => {
    // Try to enroll the same user again
    const response = await request(app)
      .post('/api/courses/enroll')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ courseId })
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User is already enrolled in this course');
  });

  test('should show enrolled course in user\'s enrolled courses', async () => {
    const response = await request(app)
      .get('/api/courses/my-courses')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.enrolledCourses).toHaveLength(1);
    expect(response.body.enrolledCourses[0]._id).toBe(courseId);
  });
  
  test('should increment totalEnrollments count correctly', async () => {
    // Verify the enrollment count was incremented
    const course = await Course.findById(courseId);
    expect(course.totalEnrollments).toBe(1);
    
    // Decode the token to get user ID
    const decoded = decodeToken(userToken);
    expect(course.enrolledUsers.map(id => id.toString())).toContain(decoded.user.id);
  });
  
  test('should handle enrollment in non-existent course', async () => {
    const response = await request(app)
      .post('/api/courses/enroll')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ courseId: 'non-existent-id' })
      .expect(404);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Course not found');
  });
});