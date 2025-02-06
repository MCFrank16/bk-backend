import request from 'supertest';
import express, { Application } from 'express';
import Controller from '../controller';
import { Order } from '../schema';

const app: Application = express();
app.use(express.json());

const controller = new Controller();
app.post('/order/create', controller.create.bind(controller));
app.get('/order/', controller.readAllOrders.bind(controller));
app.get('/order/read/:id', controller.readSingleOrder.bind(controller));
app.put('/order/update/:id', controller.updateOrder.bind(controller));
app.delete('/order/delete/:id', controller.deleteOrder.bind(controller));

jest.mock('../schema');

describe('Order Controller', () => {
    it('should create a new order', async () => {

        (Order.prototype.save as jest.Mock).mockResolvedValue({ productId: '1', farmerId: '1', quantity: 1 });

        const response = await request(app)
            .post('/order/create')
            .send({
                productId: '123',
                farmerId: '123',
                quantity: 2,
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Order is created successfully.');
    });

});
