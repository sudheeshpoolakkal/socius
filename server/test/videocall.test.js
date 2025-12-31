import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import app from '../index.js';

describe('Video Call Link Access', () => {
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
            email: 'videocall@example.com',
            password: hashedPassword
        });
        await user.save();

        // Create a test doctor
        doctor = new doctorModel({
            name: 'Test Doctor',
            email: 'doctorvc@example.com',
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

        // Create an appointment with video call link
        appointment = new appointmentModel({
            userId: user._id,
            docId: doctor._id,
            slotDate: '2025-12-15',
            slotTime: '10:00',
            amount: 100,
            payment: true,
            videoCallLink: 'https://meet.example.com/test-room'
        });
        await appointment.save();

        // Login as the user to get a token
        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'videocall@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should allow the appointment owner to access their video call link', async () => {
        const res = await supertest(app)
            .get(`/api/user/appointment/${appointment._id}/video-call-link`)
            .set('Authorization', 'Bearer ' + token);

        expect(res.status).to.equal(200);
        expect(res.body.videoCallLink).to.equal('https://meet.example.com/test-room');
    });

    it('should deny access to video call link for non-owner', async () => {
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

        // Try to access the video call link
        const res = await supertest(app)
            .get(`/api/user/appointment/${appointment._id}/video-call-link`)
            .set('Authorization', 'Bearer ' + otherToken);

        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal('Unauthorized access to appointment');
    });
});
