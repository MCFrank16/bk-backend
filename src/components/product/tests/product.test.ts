import request from 'supertest';
import express, { Application } from 'express';
import Controller from '../controller';
import { Product } from '../schema';

const app: Application = express();
app.use(express.json());

const controller = new Controller();
app.post('/product/create', controller.create.bind(controller));
app.get('/product/', controller.readAll.bind(controller));
app.get('/product/read/:id', controller.readSingle.bind(controller));
app.put('/product/update/:id', controller.updateProduct.bind(controller));
app.delete('/product/delete/:id', controller.deleteProduct.bind(controller));

jest.mock('../schema');

describe('Product Controller', () => {

    it('should create a new product successfully', async () => {
        (Product.prototype.save as jest.Mock).mockResolvedValue({ name: 'Test Product', type: 'Test Type', stock: 100 });

        const response = await request(app)
            .post('/product/create')
            .send({ name: 'Test Product', type: 'Test Type', stock: 100 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product is created successfully.');
        // expect(response.body.data).toEqual(expect.objectContaining({ name: 'Test Product', type: 'Test Type' }));
    });

    it('should return 400 if name is missing', async () => {
        const response = await request(app)
            .post('/product/create')
            .send({ type: 'Test Type' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
    });

    it('should return 400 if type is missing', async () => {
        const response = await request(app)
            .post('/product/create')
            .send({ name: 'Test Product' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Type is required');
    });

    it('should return 500 if there is a server error', async () => {
        (Product.prototype.save as jest.Mock).mockRejectedValue(new Error('Server error'));

        const response = await request(app)
            .post('/product/create')
            .send({ name: 'Test Product', type: 'Test Type', stock: 100 });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });


    describe('readAll', () => {
        it('should return all products successfully', async () => {
            const mockProducts = [
                { _id: '1', name: 'Product 1', type: 'Type 1' },
                { _id: '2', name: 'Product 2', type: 'Type 2' },
            ];
            (Product.find as jest.Mock).mockResolvedValue(mockProducts);

            const response = await request(app).get('/product/');


            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockProducts);
        });

        it('should return 500 if there is a server error', async () => {
            (Product.find as jest.Mock).mockRejectedValue(new Error('Server error'));

            const response = await request(app).get('/product/');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        });
    });

    describe('readSingle', () => {
        it('should return a single product successfully', async () => {
            const mockProduct = { _id: '1', name: 'Product 1', type: 'Type 1' };
            (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(app).get('/product/read/1');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockProduct);
        });

        it('should return 404 if product is not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/product/read/1');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Product not found.');
        });

        it('should return 500 if there is a server error', async () => {
            (Product.findById as jest.Mock).mockRejectedValue(new Error('Server error'));

            const response = await request(app).get('/product/read/1');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        });
    });
});
