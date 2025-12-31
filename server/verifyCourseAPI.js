/**
 * Course API Verification Script
 * 
 * This script demonstrates the Course API endpoints and their expected responses.
 * It's designed to be run when MongoDB is available to verify the implementation.
 * 
 * Usage: node verifyCourseAPI.js
 */

import Course from './models/Course.js';
import Module from './models/Module.js';
import Lesson from './models/Lesson.js';
import mongoose from 'mongoose';

const API_STRUCTURE = {
  endpoints: [
    {
      method: 'GET',
      path: '/api/courses',
      description: 'Get all published courses with optional filtering and sorting',
      queryParams: {
        category: 'Filter by category (e.g., "mindfulness", "communication")',
        search: 'Search in title and description',
        level: 'Filter by difficulty level ("beginner", "intermediate", "advanced")',
        sort: 'Sort by "newest" (default), "popular", "rating", or "duration"',
        limit: 'Limit number of results'
      },
      exampleResponse: {
        success: true,
        courses: [
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'Mindfulness Meditation',
            description: 'Cultivate present-moment awareness...',
            category: 'mindfulness',
            level: 'beginner',
            duration: 90,
            thumbnail: 'https://...',
            rating: 4.9,
            ratingCount: 0,
            totalEnrollments: 5800,
            concepts: 7,
            outcomes: ['Reduce stress', 'Improve focus'],
            prerequisites: ['Willingness to practice daily'],
            modules: [],
            isPublished: true,
            instructor: 'Spiritus Experts',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        count: 1
      }
    },
    {
      method: 'GET',
      path: '/api/courses/categories',
      description: 'Get list of course categories with course counts',
      queryParams: {},
      exampleResponse: {
        success: true,
        categories: [
          {
            name: 'Emotional Mastery',
            value: 'emotional-intelligence',
            count: 1
          },
          {
            name: 'Visionary Leadership',
            value: 'leadership',
            count: 1
          }
        ]
      }
    },
    {
      method: 'GET',
      path: '/api/courses/:courseId',
      description: 'Get details of a specific course by ID',
      queryParams: {},
      exampleResponse: {
        success: true,
        course: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Mindfulness Meditation',
          description: 'Cultivate present-moment awareness...',
          category: 'mindfulness',
          level: 'beginner',
          duration: 90,
          thumbnail: 'https://...',
          rating: 4.9,
          totalEnrollments: 5800,
          concepts: 7,
          outcomes: ['Reduce stress', 'Improve focus'],
          prerequisites: ['Willingness to practice daily'],
          modules: [
            {
              _id: '507f1f77bcf86cd799439012',
              title: 'Introduction to Mindfulness',
              description: 'Learn the basics',
              order: 0,
              duration: 30,
              lessons: []
            }
          ],
          isPublished: true
        }
      }
    },
    {
      method: 'POST',
      path: '/api/courses/enroll',
      description: 'Enroll authenticated user in a course',
      requiresAuth: true,
      requestBody: {
        courseId: '507f1f77bcf86cd799439011'
      },
      exampleResponse: {
        success: true,
        message: 'Successfully enrolled in course',
        userProgress: {
          userId: '507f1f77bcf86cd799439013',
          courseId: '507f1f77bcf86cd799439011',
          isEnrolled: true,
          enrollmentDate: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    {
      method: 'GET',
      path: '/api/courses/my-courses',
      description: 'Get all courses the authenticated user is enrolled in',
      requiresAuth: true,
      queryParams: {},
      exampleResponse: {
        success: true,
        enrolledCourses: [
          {
            userId: '507f1f77bcf86cd799439013',
            courseId: {
              _id: '507f1f77bcf86cd799439011',
              title: 'Mindfulness Meditation',
              // ... full course details
            },
            isEnrolled: true,
            completionPercentage: 25,
            completedLessons: [],
            completedModules: [],
            currentLesson: null
          }
        ]
      }
    }
  ],
  
  models: {
    Course: {
      fields: {
        title: { type: 'String', required: true },
        description: { type: 'String', required: true },
        category: { 
          type: 'String', 
          required: true,
          enum: [
            'self-discipline', 'yoga', 'meditation', 'communication',
            'language', 'self-confidence', 'stress-management', 
            'goal-setting', 'time-management', 'mindfulness',
            'emotional-intelligence', 'leadership', 'creativity',
            'cognitive-performance', 'other'
          ]
        },
        instructor: { type: 'String', default: 'Spiritus Experts' },
        duration: { type: 'Number', description: 'Duration in minutes' },
        level: { 
          type: 'String', 
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner'
        },
        thumbnail: { type: 'String' },
        rating: { type: 'Number', default: 0 },
        ratingCount: { type: 'Number', default: 0 },
        totalEnrollments: { type: 'Number', default: 0 },
        isPublished: { type: 'Boolean', default: false },
        modules: { type: 'Array of ObjectId', ref: 'Module' },
        prerequisites: { type: 'Array of String' },
        outcomes: { type: 'Array of String' },
        concepts: { type: 'Number', default: 0, description: 'Number of core concepts' }
      }
    },
    Module: {
      fields: {
        courseId: { type: 'ObjectId', ref: 'Course', required: true },
        title: { type: 'String', required: true },
        description: { type: 'String' },
        order: { type: 'Number', required: true },
        lessons: { type: 'Array of ObjectId', ref: 'Lesson' },
        duration: { type: 'Number', description: 'Duration in minutes' }
      }
    },
    Lesson: {
      fields: {
        moduleId: { type: 'ObjectId', ref: 'Module', required: true },
        title: { type: 'String', required: true },
        description: { type: 'String' },
        order: { type: 'Number', required: true },
        type: { 
          type: 'String',
          enum: ['video', 'text', 'exercise', 'quiz', 'audio'],
          required: true
        },
        content: { type: 'String', description: 'URL or text content' },
        duration: { type: 'Number', description: 'Duration in minutes' }
      }
    }
  }
};

async function verifyDatabaseConnection() {
  console.log('🔍 Verifying Course API Implementation\n');
  console.log('=' .repeat(60));
  
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Spiritus', { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('✅ MongoDB connected successfully\n');
    
    // Check collections
    const courseCount = await Course.countDocuments();
    const moduleCount = await Module.countDocuments();
    const lessonCount = await Lesson.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`   Courses: ${courseCount}`);
    console.log(`   Modules: ${moduleCount}`);
    console.log(`   Lessons: ${lessonCount}\n`);
    
    if (courseCount === 0) {
      console.log('⚠️  No courses found. Run: node seedCourses.js\n');
    } else {
      // Show sample course
      const sampleCourse = await Course.findOne().limit(1);
      console.log('📚 Sample Course:');
      console.log(`   Title: ${sampleCourse.title}`);
      console.log(`   Category: ${sampleCourse.category}`);
      console.log(`   Level: ${sampleCourse.level}`);
      console.log(`   Duration: ${sampleCourse.duration} minutes`);
      console.log(`   Rating: ${sampleCourse.rating}`);
      console.log(`   Enrollments: ${sampleCourse.totalEnrollments}`);
      console.log(`   Concepts: ${sampleCourse.concepts}\n`);
    }
    
    // Show category distribution
    const categories = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    if (categories.length > 0) {
      console.log('📂 Category Distribution:');
      categories.forEach(cat => {
        console.log(`   ${cat._id}: ${cat.count} course(s)`);
      });
      console.log();
    }
    
    await mongoose.connection.close();
    console.log('✅ Database verification complete\n');
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\n💡 To test the API, ensure MongoDB is running and run:');
    console.log('   1. Start MongoDB: mongod --dbpath /path/to/data');
    console.log('   2. Seed data: node seedCourses.js');
    console.log('   3. Start server: npm start\n');
  }
  
  console.log('=' .repeat(60));
  console.log('📋 API Documentation:');
  console.log('   See COURSE_API_TESTING.md for complete details\n');
  
  console.log('🔌 Available Endpoints:\n');
  API_STRUCTURE.endpoints.forEach(endpoint => {
    console.log(`   ${endpoint.method} ${endpoint.path}`);
    console.log(`   ${endpoint.description}`);
    if (endpoint.requiresAuth) {
      console.log('   🔒 Requires Authentication');
    }
    console.log();
  });
}

// Run verification
verifyDatabaseConnection();
