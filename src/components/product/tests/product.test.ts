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
        const body = { name: 'Test Product', type: 'Test Type', stock: 100, landDetails: { quantity: 30, type: 'wet'}, price: "4000" };
        (Product.prototype.save as jest.Mock).mockResolvedValue(body);

        const response = await request(app)
            .post('/product/create')
            .send(body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product is created successfully.');
    });

    it('should return 500 if there is a server error', async () => {
        const body = { name: 'Test Product', type: 'Test Type', stock: 100, landDetails: { quantity: 30, type: 'wet'}, price: "4000" };
        (Product.prototype.save as jest.Mock).mockRejectedValue(new Error('Server error'));

        const response = await request(app)
            .post('/product/create')
            .send(body);

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
