import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import Controller from '../controllers';
import { Farmer } from '../schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app: Application = express();
app.use(bodyParser.json());

const controller = new Controller();
app.post('/farmer/create', controller.create.bind(controller));
app.post('/farmer/login', controller.login.bind(controller));
app.put('/farmer/update/:id', controller.updateFarmer.bind(controller));

jest.mock('../schema');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');


beforeEach(() => {
    jest.clearAllMocks();
});

describe('Farmer Controller', () => {
    describe('POST /farmer/create', () => {

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

    describe('POST /farmer/login', () => {

        it('should login a farmer successfully', async () => {

            const mockUser = {
                email: 'farmer@gmail.com',
                phone: '2345345345',
                password: 'hashedpassword',
            };

            (Farmer.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

            const response = await request(app)
                .post('/farmer/login')
                .send({ username: 'farmer@gmail.com' , password: 'hashedpassword' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successfull');
            expect(response.body.token).toBe('fake-jwt-token');
        });


        it('should return 404 if farmer is not found', async () => {
            (Farmer.findOne as jest.Mock).mockResolvedValue(null);
            const response = await request(app)
                .post('/farmer/login')
                .send({ username: 'adminUser@gmail.com', password: 'password' });

            expect(response.status).toBe(404);
        });

        it('should return 500 if there is a server error', async () => {
            (Farmer.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .post('/farmer/login')
                .send({ username: 'adminUser@gmail.com', password: 'password' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        });
    });

    describe('UPDATE /farmer/update/:id', () => {
        it('should update a farmer successfully', async () => {

            const mockUser = {
                id: 1,
                email: 'farmer@gmail.com',
                phone: '2345345345',
                password: 'hashedpassword',
                name: 'Old Name',
                save: jest.fn().mockResolvedValue(true), // Mock save method in the controller
            };

            (Farmer.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put('/farmer/update/1')
                .send({ name: 'Frank' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Farmer updated successfully.');
        });


    })
});
