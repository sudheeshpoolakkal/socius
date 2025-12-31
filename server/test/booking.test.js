import { expect } from 'chai';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import app from '../index.js';
import * as db from './test_db.js';

describe('Appointment Booking', () => {
    let user;
    let doctor;
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

    it('should not allow booking an appointment in the past (YYYY-MM-DD)', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const slotDate = pastDate.toISOString().split('T')[0];
        const slotTime = '10:00';

        const res = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Test description',
                consultationMode: 'online'
            });

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Cannot book an appointment in the past.');
    });

    it('should not allow booking an appointment in the past (DD_MM_YYYY)', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const dd = String(pastDate.getDate()).padStart(2, '0');
        const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
        const yyyy = pastDate.getFullYear();
        const slotDate = `${dd}_${mm}_${yyyy}`;
        const slotTime = '09:00 AM';

        const res = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', 'Bearer ' + token)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Test description',
                consultationMode: 'online'
            });

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Cannot book an appointment in the past.');
    });

    it('should book an appointment and then cancel it, freeing up the slot', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const slotDate = futureDate.toISOString().split('T')[0];
        const slotTime = '11:00';

        const bookRes = await supertest(app)
            .post('/api/user/book-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({
                docId: doctor._id,
                slotDate,
                slotTime,
                patientDescription: 'Test booking and cancelling',
                consultationMode: 'online'
            });

        expect(bookRes.body.success).to.be.true;

        let updatedDoctor = await doctorModel.findById(doctor._id);
        expect(updatedDoctor.slots_booked[slotDate]).to.include(slotTime);

        const appointment = await appointmentModel.findOne({ docId: doctor._id, slotDate, slotTime });
        expect(appointment).to.not.be.null;

        const cancelRes = await supertest(app)
            .post('/api/user/cancel-appointment')
            .set('Authorization', `Bearer ${token}`)
            .send({ appointmentId: appointment._id });

        expect(cancelRes.body.success).to.be.true;
        expect(cancelRes.body.message).to.equal('Appointment Cancelled..');

        updatedDoctor = await doctorModel.findById(doctor._id);
        expect(updatedDoctor.slots_booked[slotDate]).to.be.undefined;
    });
});
