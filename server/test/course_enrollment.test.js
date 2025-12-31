import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import Course from '../models/Course.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import app from '../index.js';

describe('Course Enrollment', () => {
    let user;
    let course;
    let token;

    beforeEach(async function() {
        this.timeout(60000);
        // Clear existing test data
        await userModel.deleteMany({});
        await Course.deleteMany({});
        await UserCourseProgress.deleteMany({});

        // Create a test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = new userModel({
            name: 'Test User',
            email: 'course@example.com',
            password: hashedPassword
        });
        await user.save();

        // Create a test course
        course = new Course({
            title: 'Test Course',
            description: 'A test course for enrollment',
            category: 'meditation',
            level: 'beginner',
            thumbnail: 'test_thumb.jpg',
            totalEnrollments: 0,
            isPublished: true
        });
        await course.save();

        // Login as the user to get a token
        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'course@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should enroll a new user in a course and increment totalEnrollments', async () => {
        const res = await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token)
            .send({
                courseId: course._id.toString()
            });

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Successfully enrolled in course');

        // Verify enrollment was created
        const userProgress = await UserCourseProgress.findOne({
            userId: user._id,
            courseId: course._id
        });
        expect(userProgress).to.exist;
        expect(userProgress.isEnrolled).to.be.true;

        // Verify totalEnrollments was incremented
        const updatedCourse = await Course.findById(course._id);
        expect(updatedCourse.totalEnrollments).to.equal(1);
    });

    it('should not double-count enrollment when a user re-enrolls', async () => {
        // First enrollment
        await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token)
            .send({
                courseId: course._id.toString()
            });

        // Verify first enrollment
        let updatedCourse = await Course.findById(course._id);
        expect(updatedCourse.totalEnrollments).to.equal(1);

        // Simulate unenrollment (set isEnrolled to false)
        await UserCourseProgress.findOneAndUpdate(
            { userId: user._id, courseId: course._id },
            { isEnrolled: false }
        );

        // Re-enroll
        const res = await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token)
            .send({
                courseId: course._id.toString()
            });

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;

        // Verify enrollment status is back to true
        const userProgress = await UserCourseProgress.findOne({
            userId: user._id,
            courseId: course._id
        });
        expect(userProgress.isEnrolled).to.be.true;

        // Verify totalEnrollments was NOT incremented again (should still be 1)
        updatedCourse = await Course.findById(course._id);
        expect(updatedCourse.totalEnrollments).to.equal(1);
    });

    it('should prevent duplicate enrollment for already enrolled user', async () => {
        // First enrollment
        await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token)
            .send({
                courseId: course._id.toString()
            });

        // Try to enroll again
        const res = await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token)
            .send({
                courseId: course._id.toString()
            });

        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('User already enrolled in this course');

        // Verify totalEnrollments is still 1
        const updatedCourse = await Course.findById(course._id);
        expect(updatedCourse.totalEnrollments).to.equal(1);
    });

    it('should correctly count enrollments from multiple users', async () => {
        // Enroll first user
        await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token)
            .send({
                courseId: course._id.toString()
            });

        // Create and enroll second user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password456', salt);
        const user2 = new userModel({
            name: 'Test User 2',
            email: 'course2@example.com',
            password: hashedPassword
        });
        await user2.save();

        const loginRes = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'course2@example.com', password: 'password456' });
        const token2 = loginRes.body.token;

        await supertest(app)
            .post('/api/course/enroll')
            .set('Authorization', 'Bearer ' + token2)
            .send({
                courseId: course._id.toString()
            });

        // Verify totalEnrollments is 2
        const updatedCourse = await Course.findById(course._id);
        expect(updatedCourse.totalEnrollments).to.equal(2);
    });
});
