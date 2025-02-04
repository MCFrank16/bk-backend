import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import Controller from '../controller';
import { Admin } from '../schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app: Application = express();
app.use(bodyParser.json());

const controller = new Controller();
app.post('/admin/create', controller.create.bind(controller));
app.get('/admin/login', controller.login.bind(controller));

jest.mock('../schema');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Admin Controller', () => {
    describe('POST /admin/create', () => {


        it('should create a new admin', async () => {
            (Admin.findOne as jest.Mock).mockResolvedValue(null);
            (Admin.prototype.save as jest.Mock).mockResolvedValue({});
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

            const newAdmin = {
                email: 'adminUser@gmail.com',
                password: 'adminPass123',
                name: 'super admin',
            };

            const response = await request(app)
                .post('/admin/create')
                .send(newAdmin);

            expect(response.status).toBe(201);
        });

        it('should return 400 if details are missing', async () => {
            const newAdmin = {
                password: 'adminPass123',
            };

            const response = await request(app)
                .post('/admin/create')
                .send(newAdmin);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /admin/login', () => {

        it('should login an admin successfully', async () => {
            (Admin.findOne as jest.Mock).mockResolvedValue({
              email: 'adminUser@gmail.com',
              password: 'hashedpassword',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');
        
            const response = await request(app)
              .get('/admin/login')
              .query({ email: 'adminUser@gmail.com', password: 'password' });
        
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBe('fake-jwt-token');
          });
        

          it('should return 404 if admin is not found', async () => {
            (Admin.findOne as jest.Mock).mockResolvedValue(null);
        
            const response = await request(app)
              .get('/admin/login')
              .query({ email: 'adminUser@gmail.com', password: 'password' });
        
            expect(response.status).toBe(404);

          });
        
          it('should return 500 if there is a server error', async () => {
            (Admin.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));
        
            const response = await request(app)
              .get('/admin/login')
              .query({ email: 'adminUser@gmail.com', password: 'password' });
        
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
          });
    });
});
