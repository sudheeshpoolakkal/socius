import { expect } from 'chai';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import app from '../index.js';
import * as db from './test_db.js';

describe('Appointment Cancellation', () => {
    let user;
    let doctor;
    let appointment;
    let token;

    before(async () => {
        await db.connect();
    });

    after(async () => {
        await db.disconnect();
    });

    beforeEach(async () => {
        await db.clear();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = new userModel({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
        });
        await user.save();

        doctor = new doctorModel({
            name: 'Test Doctor',
            email: 'doctor@example.com',
            password: 'password123',
            image: 'test_image.jpg',
            speciality: 'Cardiology',
            experience: '10 years',
            about: 'A test doctor.',
            address: {
                line1: '123 Main St',
            },
            degree: 'MD',
            date: Date.now(),
            fees: 100,
            available: true,
            slots_booked: {}
        });
        await doctor.save();

        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'test@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should book an appointment and then fail to release the slot upon cancellation', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '10:00';

        const bookRes = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Test description',
                consultationMode: 'online'
            });

        expect(bookRes.body.success).to.be.true;

        appointment = await appointmentModel.findOne({ userId: user._id });
        expect(appointment).to.exist;

        const updatedDoctor = await doctorModel.findById(doctor._id);
        expect(updatedDoctor.slots_booked[slotDate]).to.include(slotTime);

        const cancelRes = await supertest(app)
            .post('/api/user/cancel-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({ appointmentId: appointment._id });

        expect(cancelRes.body.success).to.be.true;

        const finalDoctor = await doctorModel.findById(doctor._id);
        expect(finalDoctor.slots_booked[slotDate]).to.be.undefined;
    });

    it('should handle cancellation of an appointment for a deleted doctor gracefully', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '11:00';

        const bookRes = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Another test description',
                consultationMode: 'online'
            });

        expect(bookRes.body.success).to.be.true;
        const newAppointment = await appointmentModel.findOne({ userId: user._id, slotDate: slotDate });
        expect(newAppointment).to.exist;

        await doctorModel.findByIdAndDelete(doctor._id);

        const cancelRes = await supertest(app)
            .post('/api/user/cancel-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({ appointmentId: newAppointment._id });

        expect(cancelRes.status).to.equal(200);
        expect(cancelRes.body.success).to.be.true;

        const cancelledAppointment = await appointmentModel.findById(newAppointment._id);
        expect(cancelledAppointment.cancelled).to.be.true;
    });
});

describe('Appointment Expiry', () => {
    let user;
    let doctor;
    let appointment;
    let token;

    beforeEach(async function() {
        this.timeout(60000); // Increase timeout for before hook
        // Clear existing test data
        await userModel.deleteMany({});
        await doctorModel.deleteMany({});
        await appointmentModel.deleteMany({});

        // Create a test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = new userModel({
            name: 'Test User',
            email: 'testexpiry@example.com',
            password: hashedPassword
        });
        await user.save();

        // Create a test doctor
        doctor = new doctorModel({
            name: 'Test Expiry Doctor',
            email: 'doctorexpiry@example.com',
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

        // Login as the user to get a token
        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'testexpiry@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should book an appointment with expiry time set', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '10:00';

        const bookRes = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', 'Bearer ' + token)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Test description for expiry',
                consultationMode: 'online'
            });

        expect(bookRes.body.success).to.be.true;

        // Find the created appointment
        appointment = await appointmentModel.findOne({ userId: user._id });
        expect(appointment).to.exist;
        expect(appointment.expiresAt).to.exist;

        // Verify that the expiry time is ~30 minutes from now
        const now = new Date();
        const expectedExpiry = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
        const timeDiff = Math.abs(appointment.expiresAt.getTime() - expectedExpiry.getTime());
        
        // Allow some tolerance for execution time (1 minute)
        expect(timeDiff).to.be.lessThan(60000); // 60 seconds
    });

    it('should fail to process payment for an expired appointment', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '11:00';

        // Book an appointment
        appointment = new appointmentModel({
            userId: user._id,
            docId: doctor._id,
            slotDate,
            slotTime,
            patientDescription: 'Test description',
            consultationMode: 'online',
            date: new Date(),
            userData: user,
            docData: doctor,
            expiresAt: new Date(Date.now() - 1000) // Expired
        });
        await appointment.save();

        // Try to process payment for the expired appointment
        const paymentRes = await supertest(app)
            .post('/api/user/process-payment')
            .set('Authorization', 'Bearer ' + token)
            .send({ appointmentId: appointment._id });

        expect(paymentRes.body.success).to.be.false;
        expect(paymentRes.body.message).to.equal('Appointment payment time has expired');
        
        // Verify that the appointment is marked as cancelled
        const updatedAppointment = await appointmentModel.findById(appointment._id);
        expect(updatedAppointment.cancelled).to.be.true;
        expect(updatedAppointment.payment).to.be.false;
    });

    it('should successfully process payment for a non-expired appointment', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '12:00';

        // Book an appointment
        appointment = new appointmentModel({
            userId: user._id,
            docId: doctor._id,
            slotDate,
            slotTime,
            patientDescription: 'Test description',
            consultationMode: 'online',
            date: new Date(),
            userData: user,
            docData: doctor,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Not expired
        });
        await appointment.save();

        // Process payment for the non-expired appointment
        const paymentRes = await supertest(app)
            .post('/api/user/process-payment')
            .set('Authorization', 'Bearer ' + token)
            .send({ appointmentId: appointment._id });

        expect(paymentRes.body.success).to.be.true;
        expect(paymentRes.body.message).to.equal('Payment processed successfully');
        
        // Verify that the appointment is marked as paid
        const updatedAppointment = await appointmentModel.findById(appointment._id);
        expect(updatedAppointment.payment).to.be.true;
        expect(updatedAppointment.cancelled).to.be.false;
    });

    it('should return appointment status with expiry information', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '13:00';

        // Book an appointment
        appointment = new appointmentModel({
            userId: user._id,
            docId: doctor._id,
            slotDate,
            slotTime,
            patientDescription: 'Test description',
            consultationMode: 'online',
            date: new Date(),
            userData: user,
            docData: doctor,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Not expired
        });
        await appointment.save();

        // Get appointment status
        const statusRes = await supertest(app)
            .get(`/api/user/appointment/${appointment._id}/status`)
            .set('Authorization', 'Bearer ' + token);

        expect(statusRes.body.success).to.be.true;
        expect(statusRes.body.appointment).to.exist;
        expect(new Date(statusRes.body.appointment.expiresAt).getTime()).to.equal(appointment.expiresAt.getTime());
        expect(statusRes.body.appointment.hasExpired).to.be.false; // Should not be expired yet
        expect(statusRes.body.timeLeft).to.be.a('number');
        expect(statusRes.body.timeLeft).to.be.greaterThan(0);
    });

    it('should protect video call link route with auth and ownership', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '14:00';

        const bookRes = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', 'Bearer ' + token)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Video call check',
                consultationMode: 'online'
            });

        expect(bookRes.body.success).to.be.true;
        const createdAppt = await appointmentModel.findOne({ userId: user._id, slotDate });

        // Without auth
        const noAuth = await supertest(app)
            .get(`/api/user/video-call/${createdAppt._id}`);
        expect(noAuth.status).to.equal(401);

        // With other user auth
        const otherUser = new userModel({ name: 'Other', email: 'other@example.com', password: await bcrypt.hash('password123', 10) });
        await otherUser.save();
        const otherLogin = await supertest(app).post('/api/user/login').send({ email: 'other@example.com', password: 'password123' });
        const otherToken = otherLogin.body.token;

        const forbidden = await supertest(app)
            .get(`/api/user/video-call/${createdAppt._id}`)
            .set('Authorization', 'Bearer ' + otherToken);
        expect(forbidden.status).to.equal(403);

        // Owner can access
        const ok = await supertest(app)
            .get(`/api/user/video-call/${createdAppt._id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(ok.status).to.equal(200);
        expect(ok.body).to.have.property('videoCallLink');
    });
});
