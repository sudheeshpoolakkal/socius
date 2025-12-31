import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import courseRoute from '../routes/courseRoute.js';
import Course from '../models/Course.js';

const app = express();
app.use(express.json());
app.use('/api/courses', courseRoute);

describe('Course API Endpoints', function() {
  this.timeout(10000);

  before(async function() {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://127.0.0.1:27017/SpiritusTest', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  after(async function() {
    // Clean up and close connection
    await Course.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async function() {
    // Clear courses before each test
    await Course.deleteMany({});
  });

  describe('GET /api/courses/categories', function() {
    it('should return list of course categories', async function() {
      const res = await request(app)
        .get('/api/courses/categories')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('categories');
      expect(res.body.categories).to.be.an('array');
      expect(res.body.categories.length).to.be.greaterThan(0);
      
      // Check first category structure
      const category = res.body.categories[0];
      expect(category).to.have.property('name');
      expect(category).to.have.property('value');
      expect(category).to.have.property('count');
    });
  });

  describe('GET /api/courses', function() {
    beforeEach(async function() {
      // Create sample courses for testing
      await Course.create([
        {
          title: 'Test Course 1',
          description: 'Test description 1',
          category: 'mindfulness',
          level: 'beginner',
          duration: 60,
          isPublished: true,
          rating: 4.5,
          totalEnrollments: 100,
          concepts: 5
        },
        {
          title: 'Test Course 2',
          description: 'Test description 2',
          category: 'communication',
          level: 'intermediate',
          duration: 120,
          isPublished: true,
          rating: 4.8,
          totalEnrollments: 200,
          concepts: 8
        },
        {
          title: 'Unpublished Course',
          description: 'Should not appear',
          category: 'yoga',
          level: 'beginner',
          duration: 90,
          isPublished: false
        }
      ]);
    });

    it('should return all published courses', async function() {
      const res = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('courses');
      expect(res.body.courses).to.be.an('array');
      expect(res.body.courses.length).to.equal(2); // Only published courses
      expect(res.body).to.have.property('count', 2);
    });

    it('should filter courses by category', async function() {
      const res = await request(app)
        .get('/api/courses?category=mindfulness')
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.courses.length).to.equal(1);
      expect(res.body.courses[0].category).to.equal('mindfulness');
    });

    it('should filter courses by level', async function() {
      const res = await request(app)
        .get('/api/courses?level=beginner')
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.courses.length).to.equal(1);
      expect(res.body.courses[0].level).to.equal('beginner');
    });

    it('should search courses by title', async function() {
      const res = await request(app)
        .get('/api/courses?search=Test Course 1')
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.courses.length).to.equal(1);
      expect(res.body.courses[0].title).to.include('Test Course 1');
    });

    it('should sort courses by rating', async function() {
      const res = await request(app)
        .get('/api/courses?sort=rating')
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.courses.length).to.equal(2);
      expect(res.body.courses[0].rating).to.be.at.least(res.body.courses[1].rating);
    });

    it('should sort courses by popularity', async function() {
      const res = await request(app)
        .get('/api/courses?sort=popular')
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.courses[0].totalEnrollments).to.be.at.least(res.body.courses[1].totalEnrollments);
    });

    it('should limit number of courses returned', async function() {
      const res = await request(app)
        .get('/api/courses?limit=1')
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.courses.length).to.equal(1);
    });
  });

  describe('GET /api/courses/:courseId', function() {
    let courseId;

    beforeEach(async function() {
      const course = await Course.create({
        title: 'Detailed Course',
        description: 'Detailed description',
        category: 'mindfulness',
        level: 'beginner',
        duration: 60,
        isPublished: true,
        outcomes: ['Outcome 1', 'Outcome 2'],
        prerequisites: ['Prereq 1']
      });
      courseId = course._id;
    });

    it('should return course details', async function() {
      const res = await request(app)
        .get(`/api/courses/${courseId}`)
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('course');
      expect(res.body.course.title).to.equal('Detailed Course');
      expect(res.body.course.outcomes).to.be.an('array');
    });

    it('should return 404 for non-existent course', async function() {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/courses/${fakeId}`)
        .expect(404);

      expect(res.body.success).to.be.false;
      expect(res.body.message).to.include('not found');
    });
  });
});
