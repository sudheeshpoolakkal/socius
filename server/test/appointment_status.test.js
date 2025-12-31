import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import app from '../index.js';

describe('Appointment Status', () => {
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
            email: 'status@example.com',
            password: hashedPassword
        });
        await user.save();

        // Create a test doctor
        doctor = new doctorModel({
            name: 'Test Doctor',
            email: 'doctorstatus@example.com',
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
            slots_booked: {}
        });
        await doctor.save();

        // Create an appointment with expiry
        const expiryTime = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
        appointment = new appointmentModel({
            userId: user._id,
            docId: doctor._id,
            slotDate: '2025-12-20',
            slotTime: '14:00',
            amount: 100,
            payment: false,
            expiresAt: expiryTime
        });
        await appointment.save();

        // Login as the user to get a token
        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'status@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should allow the appointment owner to check appointment status', async () => {
        const res = await supertest(app)
            .get(`/api/user/appointment/${appointment._id}/status`)
            .set('Authorization', 'Bearer ' + token);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.appointment).to.exist;
        expect(res.body.appointment._id).to.equal(appointment._id.toString());
        expect(res.body.appointment.hasExpired).to.be.false;
        expect(res.body.timeLeft).to.be.greaterThan(0);
    });

    it('should deny access to appointment status for non-owner', async () => {
        // Create another user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password456', salt);
        const otherUser = new userModel({
            name: 'Other User',
            email: 'otherstatus@example.com',
            password: hashedPassword
        });
        await otherUser.save();

        // Login as the other user
        const loginRes = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'otherstatus@example.com', password: 'password456' });
        const otherToken = loginRes.body.token;

        // Try to check the appointment status
        const res = await supertest(app)
            .get(`/api/user/appointment/${appointment._id}/status`)
            .set('Authorization', 'Bearer ' + otherToken);

        expect(res.status).to.equal(403);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Unauthorized access to appointment');
    });

    it('should correctly identify an expired appointment', async () => {
        // Update appointment to have expired time
        const pastTime = new Date(Date.now() - 1000); // 1 second ago
        await appointmentModel.findByIdAndUpdate(appointment._id, { expiresAt: pastTime });

        const res = await supertest(app)
            .get(`/api/user/appointment/${appointment._id}/status`)
            .set('Authorization', 'Bearer ' + token);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.appointment.hasExpired).to.be.true;
        expect(res.body.timeLeft).to.equal(0);
    });
});
