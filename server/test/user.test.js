import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import app from '../index.js'; // Import the app

describe('User Profile', () => {
    let user;
    let token;

    before(async function() {
        this.timeout(10000); // Increase timeout for before hook
        await userModel.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = new userModel({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
        });
        await user.save();

        const res = await supertest(app)
            .post('/api/user/login')
            .send({ email: 'test@example.com', password: 'password123' });
        token = res.body.token;
    });

    it('should return a 400 error when address is invalid JSON', async () => {
        const res = await supertest(app)
            .put('/api/user/update-profile')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Test User',
                phone: '1234567890',
                address: 'invalid json',
                dob: '2000-01-01',
                gender: 'male'
            });
        
        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Invalid address format.');
    });
});
