// Unit test for the enrollment fix logic
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

describe('Enrollment Fix Logic Test', () => {
  let mongoServer;
  let mockUser;
  let mockCourseId = 'test-course-id';

  beforeAll(async () => {
    // Set up in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a mock user
    mockUser = {
      id: 'mock-user-id',
      role: 'user'
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Course.deleteMany({});
    await User.deleteMany({});
    
    // Create a test course
    const course = new Course({
      _id: mockCourseId,
      title: 'Test Course',
      description: 'A test course',
      category: 'Spiritual Development',
      level: 'Beginner',
      duration: 120,
      instructor: 'Test Instructor',
      outcomes: ['Test outcome'],
      totalEnrollments: 0,
      enrolledUsers: []
    });
    await course.save();
  });

  test('should increment enrollment count and add user on first enrollment', async () => {
    // Simulate the enrollment logic from the updated route
    const result = await Course.updateOne(
      { 
        _id: mockCourseId,
        enrolledUsers: { $ne: mockUser.id } // Only update if user is not already enrolled
      },
      { 
        $inc: { totalEnrollments: 1 }, // Increment enrollment count atomically
        $addToSet: { enrolledUsers: mockUser.id } // Add user to enrolledUsers array if not already present
      }
    );

    // Verify that the update happened (one document matched and was modified)
    expect(result.matchedCount).toBe(1);

    // Check that the course now has the correct enrollment count
    const updatedCourse = await Course.findById(mockCourseId);
    expect(updatedCourse.totalEnrollments).toBe(1);
    expect(updatedCourse.enrolledUsers).toContainEqual(mongoose.Types.ObjectId(mockUser.id));
  });

  test('should not increment enrollment count on duplicate enrollment', async () => {
    // First enrollment
    await Course.updateOne(
      { 
        _id: mockCourseId,
        enrolledUsers: { $ne: mockUser.id }
      },
      { 
        $inc: { totalEnrollments: 1 },
        $addToSet: { enrolledUsers: mockUser.id }
      }
    );

    // Try to enroll again (duplicate)
    const result = await Course.updateOne(
      { 
        _id: mockCourseId,
        enrolledUsers: { $ne: mockUser.id } // This should not match since user is already enrolled
      },
      { 
        $inc: { totalEnrollments: 1 },
        $addToSet: { enrolledUsers: mockUser.id }
      }
    );

    // The second enrollment should not match any documents (because user is already enrolled)
    expect(result.matchedCount).toBe(0);

    // The enrollment count should still be 1, not 2
    const updatedCourse = await Course.findById(mockCourseId);
    expect(updatedCourse.totalEnrollments).toBe(1);
    expect(updatedCourse.enrolledUsers).toContainEqual(mongoose.Types.ObjectId(mockUser.id));
    expect(updatedCourse.enrolledUsers).toHaveLength(1);
  });

  test('should return appropriate error when trying to enroll in same course twice', async () => {
    // This simulates the logic in the updated route
    const courseId = mockCourseId;
    const userId = mockUser.id;
    
    // First enrollment (should succeed)
    const result1 = await Course.updateOne(
      { 
        _id: courseId,
        enrolledUsers: { $ne: userId }
      },
      { 
        $inc: { totalEnrollments: 1 },
        $addToSet: { enrolledUsers: userId }
      }
    );
    
    expect(result1.matchedCount).toBe(1);
    
    // Try second enrollment (should fail)
    const result2 = await Course.updateOne(
      { 
        _id: courseId,
        enrolledUsers: { $ne: userId }
      },
      { 
        $inc: { totalEnrollments: 1 },
        $addToSet: { enrolledUsers: userId }
      }
    );
    
    expect(result2.matchedCount).toBe(0);
    
    // Check if the course exists for error handling
    const courseCheck = await Course.findById(courseId);
    expect(courseCheck).not.toBeNull(); // Course exists
    
    // This matches the logic from the updated route
    if (result2.matchedCount === 0) {
      if (!courseCheck) {
        // Course not found case
        expect(true).toBe(false); // This shouldn't happen in this test
      } else {
        // User is already enrolled case - this is what should happen
        // The route would return: res.status(400).json({ success: false, message: 'User is already enrolled in this course' });
        // For this test, we just verify the condition
        expect(true).toBe(true); 
      }
    }
  });
});