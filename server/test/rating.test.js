import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import app from '../index.js';

describe('Doctor Rating', () => {
    let user;
    let doctor;
    let appointment;
    let token;

    beforeEach(async function() {
        this.timeout(60000);
        // Clear existing test data
        await userModel.deleteMany({});
        await doctorModel.deleteMany({});
        await appointmentModel.deleteMany({});

        // Create a test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = new userModel({
            name: 'Test User',
            email: 'rating@example.com',
            password: hashedPassword
        });
        await user.save();

        // Create a test doctor
        doctor = new doctorModel({
            name: 'Test Doctor',
            email: 'doctorrating@example.com',
            password: 'password123',
            image: 'test_image.jpg',
            speciality: 'Test Speciality',
            experience: '5 years',
            about: 'Test about section',
            address: {
                line1: '123 Test St',
                line2: 'Test City',
                plusCode: '12345',
                formatted: '123 Test St, Test City, 12345',
                placeId: 'test_place_id'
            },
            degree: 'MD',
            date: Date.now(),
            fees: 100,
            available: true,
            slots_booked: {},
            rating: 0,
            ratingCount: 0,
            reviews: []
        });
        await doctor.save();

        // Create a completed appointment
        appointment = new appointmentModel({
            userId: user._id,
            docId: doctor._id,
            slotDate: '2025-10-05',
            slotTime: '10:00',
            amount: 100,
            payment: true,
            isCompleted: true,
            cancelled: false
        });
        await appointment.save();

        // Login as the user to get a token
        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'rating@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should allow the appointment owner to rate their completed appointment', async () => {
        const res = await supertest(app)
            .post('/api/user/rate-doctor')
            .set('Authorization', 'Bearer ' + token)
            .send({
                appointmentId: appointment._id.toString(),
                rating: 5,
                review: 'Excellent doctor!',
                docId: doctor._id.toString()
            });

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Rating and review submitted successfully');

        // Verify the appointment was updated
        const updatedAppointment = await appointmentModel.findById(appointment._id);
        expect(updatedAppointment.rating).to.equal(5);
        expect(updatedAppointment.review).to.equal('Excellent doctor!');

        // Verify the doctor's rating was updated
        const updatedDoctor = await doctorModel.findById(doctor._id);
        expect(updatedDoctor.rating).to.equal(5);
        expect(updatedDoctor.ratingCount).to.equal(1);
    });

    it('should prevent user from rating an appointment that does not belong to them', async () => {
        // Create another user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password456', salt);
        const otherUser = new userModel({
            name: 'Other User',
            email: 'other@example.com',
            password: hashedPassword
        });
        await otherUser.save();

        // Login as the other user
        const loginRes = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'other@example.com', password: 'password456' });
        const otherToken = loginRes.body.token;

        // Try to rate the appointment
        const res = await supertest(app)
            .post('/api/user/rate-doctor')
            .set('Authorization', 'Bearer ' + otherToken)
            .send({
                appointmentId: appointment._id.toString(),
                rating: 5,
                review: 'Great doctor!',
                docId: doctor._id.toString()
            });

        expect(res.status).to.equal(403);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('You are not authorized to rate this appointment');
    });

    it('should prevent user from rating an appointment with wrong doctor ID', async () => {
        // Create another doctor
        const otherDoctor = new doctorModel({
            name: 'Other Doctor',
            email: 'otherdoc@example.com',
            password: 'password123',
            image: 'test_image.jpg',
            speciality: 'Other Speciality',
            experience: '3 years',
            about: 'Other about section',
            address: {
                line1: '456 Other St',
                line2: 'Other City',
                plusCode: '67890',
                formatted: '456 Other St, Other City, 67890',
                placeId: 'other_place_id'
            },
            degree: 'MD',
            date: Date.now(),
            fees: 150,
            available: true,
            slots_booked: {},
            rating: 0,
            ratingCount: 0,
            reviews: []
        });
        await otherDoctor.save();

        // Try to rate with the wrong doctor ID
        const res = await supertest(app)
            .post('/api/user/rate-doctor')
            .set('Authorization', 'Bearer ' + token)
            .send({
                appointmentId: appointment._id.toString(),
                rating: 5,
                review: 'Great doctor!',
                docId: otherDoctor._id.toString() // Wrong doctor!
            });

        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Only completed appointments can be rated for the correct doctor');
    });
});
