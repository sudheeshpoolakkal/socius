import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import Prescription from '../models/Prescription.js';
import app from '../index.js';

describe('Prescription Functionality', () => {
    let user;
    let doctor;
    let appointment;
    let userToken;
    let doctorToken;
    let adminToken;

    beforeAll(async function() {
        this.timeout(60000); // Increase timeout for before hook
        // Clear existing test data
        await userModel.deleteMany({});
        await doctorModel.deleteMany({});
        await appointmentModel.deleteMany({});
        await Prescription.deleteMany({});

        // Create a test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = new userModel({
            name: 'Test User',
            email: 'testprescription@example.com',
            password: hashedPassword
        });
        await user.save();

        // Create a test doctor
        doctor = new doctorModel({
            name: 'Test Doctor',
            email: 'doctorprescription@example.com',
            password: hashedPassword, // Note: This should be plain text in real app, but we're reusing the hashed one for tests
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
        const userRes = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'testprescription@example.com', password: 'password123' });
        userToken = userRes.body.token;
        
        // Login as the doctor to get a token
        const doctorRes = await supertest(app)
            .post('/api/doctor/login')
            .send({ email: 'doctorprescription@example.com', password: 'password123' });
        doctorToken = doctorRes.body.token;
        
        // Create an admin token (this might be different in your actual implementation)
        adminToken = userToken; // Using user token for now, but might need actual admin token logic

        // Create an appointment
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '10:00';

        const bookRes = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', 'Bearer ' + userToken)
            .send({
                docId: doctor._id.toString(),
                slotDate,
                slotTime,
                patientDescription: 'Test description for prescription',
                consultationMode: 'online'
            });

        expect(bookRes.body.success).to.be.true;
        
        appointment = await appointmentModel.findOne({ userId: user._id.toString() });
        expect(appointment).to.exist;
    });

    afterAll(async () => {
        await userModel.deleteMany({});
        await doctorModel.deleteMany({});
        await appointmentModel.deleteMany({});
        await Prescription.deleteMany({});
    });

    describe('Bug Fix 1: Appointment model prescription field', () => {
        it('should save prescription data to appointment when added by doctor', async () => {
            // Doctor adds a prescription
            const report = 'This is a test medical report with more than thirty words to meet the required word count for validation purposes. This report contains detailed medical information and recommendations for the patient. The patient should follow the prescribed treatment plan carefully. Regular monitoring is required to ensure proper healing and recovery. Additional tests may be necessary next week. Please schedule a follow-up appointment.';
            
            const prescriptionRes = await supertest(app)
                .post('/api/prescription/add')
                .set('Authorization', 'Bearer ' + doctorToken)
                .field('appointmentId', appointment._id.toString())
                .field('report', report);

            expect(prescriptionRes.body.success).to.be.true;

            // Check if the appointment now has prescription data
            const updatedAppointment = await appointmentModel.findById(appointment._id);
            expect(updatedAppointment.prescription).to.exist;
            expect(updatedAppointment.prescription.report).to.equal(report);
        });
    });

    describe('Bug Fix 2: Doctor cancel appointment releases slot', () => {
        it('should release the time slot when a doctor cancels an appointment', async () => {
            // Create another appointment for testing
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 2);
            const slotDate = futureDate.toISOString().split('T')[0];
            const slotTime = '11:00';

            const bookRes = await supertest(app)
                .post('/api/user/book-appointment')
                .set('Authorization', 'Bearer ' + userToken)
                .send({
                    docId: doctor._id.toString(),
                    slotDate,
                    slotTime,
                    patientDescription: 'Test description for slot release',
                    consultationMode: 'online'
                });

            expect(bookRes.body.success).to.be.true;

            const newAppointment = await appointmentModel.findOne({ 
                userId: user._id.toString(), 
                slotDate 
            });
            expect(newAppointment).to.exist;

            // Verify that the slot is booked by checking doctor's slots
            const doctorBeforeCancel = await doctorModel.findById(doctor._id);
            expect(doctorBeforeCancel.slots_booked[slotDate]).to.include(slotTime);

            // Doctor cancels the appointment
            const cancelRes = await supertest(app)
                .post('/api/doctor/cancel-appointment')
                .set('Authorization', 'Bearer ' + doctorToken)
                .send({ 
                    docId: doctor._id.toString(),
                    appointmentId: newAppointment._id.toString() 
                });

            expect(cancelRes.body.success).to.be.true;

            // Verify that the slot is released
            const doctorAfterCancel = await doctorModel.findById(doctor._id);
            expect(doctorAfterCancel.slots_booked[slotDate]).to.not.include(slotTime);
        });
    });

    describe('Bug Fix 3: Prescription authorization', () => {
        it('should allow authorized users to access their prescriptions', async () => {
            // First, create a prescription for the appointment
            const report = 'This is a test medical report with more than thirty words to meet the required word count for validation purposes. This report contains detailed medical information and recommendations for the patient. The patient should follow the prescribed treatment plan carefully. Regular monitoring is required to ensure proper healing and recovery. Additional tests may be necessary next week. Please schedule a follow-up appointment.';
            
            const prescriptionRes = await supertest(app)
                .post('/api/prescription/add')
                .set('Authorization', 'Bearer ' + doctorToken)
                .field('appointmentId', appointment._id.toString())
                .field('report', report);

            expect(prescriptionRes.body.success).to.be.true;

            // Test that the user can access their own prescription
            const userAccessRes = await supertest(app)
                .get(`/api/prescription/user/${appointment._id}`)
                .set('Authorization', 'Bearer ' + userToken);

            expect(userAccessRes.status).to.equal(200);
            expect(userAccessRes.body.success).to.be.true;
            expect(userAccessRes.body.prescription).to.exist;
        });

        it('should prevent unauthorized users from accessing prescriptions', async () => {
            // Create another user to test unauthorized access
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            const otherUser = new userModel({
                name: 'Other User',
                email: 'otheruser@example.com',
                password: hashedPassword
            });
            await otherUser.save();

            // Login as the other user to get a token
            const otherUserRes = await supertest(app)
                .post('/api/user/login')
                .send({ email: 'otheruser@example.com', password: 'password123' });
            const otherUserToken = otherUserRes.body.token;

            // Test that another user cannot access a different user's prescription
            const unauthorizedRes = await supertest(app)
                .get(`/api/prescription/user/${appointment._id}`)
                .set('Authorization', 'Bearer ' + otherUserToken);

            expect(unauthorizedRes.status).to.equal(200); // Assuming 200 status with error message
            expect(unauthorizedRes.body.success).to.be.false;
            expect(unauthorizedRes.body.message).to.contain('Unauthorized');
        });

        it('should prevent access with invalid appointment ID', async () => {
            const invalidRes = await supertest(app)
                .get('/api/prescription/user/invalidid123')
                .set('Authorization', 'Bearer ' + userToken);

            expect(invalidRes.status).to.equal(200); // Assuming 200 status with error message
            expect(invalidRes.body.success).to.be.false;
            expect(invalidRes.body.message).to.contain('Invalid appointment ID');
        });
    });

    describe('Bug Fix 4: Word count validation', () => {
        it('should reject reports with less than 30 words', async () => {
            const shortReport = 'This is a short report that does not meet the minimum word count requirement.';
            
            const prescriptionRes = await supertest(app)
                .post('/api/prescription/add')
                .set('Authorization', 'Bearer ' + doctorToken)
                .field('appointmentId', appointment._id.toString())
                .field('report', shortReport);

            expect(prescriptionRes.status).to.equal(200);
            expect(prescriptionRes.body.success).to.be.false;
            expect(prescriptionRes.body.message).to.contain('Report must be at least 30 words');
        });

        it('should accept reports with at least 30 words', async () => {
            const validReport = 'This is a test medical report with more than thirty words to meet the required word count for validation purposes. This report contains detailed medical information and recommendations for the patient. The patient should follow the prescribed treatment plan carefully. Regular monitoring is required to ensure proper healing and recovery. Additional tests may be necessary next week. Please schedule a follow-up appointment.';
            
            const prescriptionRes = await supertest(app)
                .post('/api/prescription/add')
                .set('Authorization', 'Bearer ' + doctorToken)
                .field('appointmentId', appointment._id.toString())
                .field('report', validReport);

            expect(prescriptionRes.body.success).to.be.true;
        });

        it('should properly count words with multiple spaces', async () => {
            const reportWithSpaces = 'This   has   multiple   spaces   between   words   but   should   still   count   as   more   than   thirty   words   for   testing   purposes   and   validation   requirements   in   the   system.';
            
            const prescriptionRes = await supertest(app)
                .post('/api/prescription/add')
                .set('Authorization', 'Bearer ' + doctorToken)
                .field('appointmentId', appointment._id.toString())
                .field('report', reportWithSpaces);

            expect(prescriptionRes.body.success).to.be.true;
        });
    });
});