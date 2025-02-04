import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import Controller from '../controllers';
import { Farmer } from '../schema';
import bcrypt from 'bcrypt';

const app: Application = express();
app.use(bodyParser.json());

const controller = new Controller();
app.post('/farmer/create', controller.create.bind(controller));
app.get('/farmer/login', controller.login.bind(controller));

jest.mock('../schema');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
import jwt from 'jsonwebtoken';

describe('Admin Controller', () => {
    describe('POST /admin/create', () => {

        it('should create a new farmer successfully', async () => {
            (Farmer.findOne as jest.Mock).mockResolvedValue(null);
            (Farmer.prototype.save as jest.Mock).mockResolvedValue({});
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

            const response = await request(app)
                .post('/farmer/create')
                .send({ email: 'test@example.com', phone: '1234567890', password: 'password', name: 'Test Farmer', landDetails: { size: 1, location: 'Test Location' } });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Farmer is created successfully.');
        });

        it('should return 400 if details are missing', async () => {
            const newAdmin = {
                password: 'adminPass123',
            };

            const response = await request(app)
                .post('/farmer/create')
                .send(newAdmin);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /admin/login', () => {

        it('should login a farmer successfully', async () => {
            (Farmer.findOne as jest.Mock).mockResolvedValue({
                username: 'adminUser@gmail.com',
                password: 'hashedpassword',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

            const response = await request(app)
                .get('/farmer/login')
                .query({ username: 'adminUser@gmail.com', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBe('fake-jwt-token');
        });


        it('should return 404 if farmer is not found', async () => {
            (Farmer.findOne as jest.Mock).mockResolvedValue(null);
            const response = await request(app)
                .get('/farmer/login')
                .query({ username: 'adminUser@gmail.com', password: 'password' });

            expect(response.status).toBe(404);
        });

        it('should return 500 if there is a server error', async () => {
            (Farmer.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .get('/farmer/login')
                .query({ username: 'adminUser@gmail.com', password: 'password' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        });
    });
});
