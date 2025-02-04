import { Request, Response } from 'express'
import { Order, IOrder } from "./schema";
import { trusted } from 'mongoose';

class Controller {

    async create(req: Request, res: Response): Promise<any> {
        try {
            const { productId, quantity, farmerId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product id is required' });
            }

            if (!quantity) {
                return res.status(400).json({ message: 'Quantity is required' });
            }


            if (!farmerId) {
                return res.status(400).json({ message: 'Farmer id is required' });
            }

            const newOrder = new Order();

            newOrder.product = productId;
            newOrder.quantity = quantity;
            newOrder.farmer = farmerId;

            await newOrder.save();

            return res.status(201).json({
                message: "Order is created successfully.",
                data: newOrder
            });

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async readAllOrders(req: Request, res: Response): Promise<any> {
        try {
            const { type } = req.params;
            const { farmerId } = req.body;

            let orders: IOrder[] = [];

            if (type == 'farmers') {
                if (!farmerId) {
                    return res.status(400).json({ message: 'Farmer id is required' });
                }

                orders = await Order.find({ farmer: farmerId });
            }


            if (type == 'all') {
                orders = await Order.find();
            }

            return res.status(200).json({
                data: orders
            });
        } catch(error){
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async readSingleOrder(req: Request, res: Response): Promise<any> {
        try {
            const { orderId } = req.body;

            if (!orderId) {
                return res.status(400).json({ message: 'Order id is required' });
            }

            const order: IOrder | null = await Order.findOne({ id: orderId });

            return res.status(200).json({
                data: order
            });
        } catch(error){
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async updateOrder(req: Request, res: Response): Promise<any> {
        try {

            const { orderId, status, quantity } = req.body;

            if (!orderId) {
                return res.status(400).json({ message: 'Order id is required' });
            }

            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }

            if (!quantity) {
                return res.status(400).json({ message: 'Quantity is required' });
            }

            const order: IOrder | null = await Order.findOne({ id: orderId });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            
            order.quantity = quantity;
            order.status = status;

            await order.save();

            return res.status(200).json({
                data: order
            });
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }   

    async deleteOrder(req: Request, res: Response): Promise<any> {
        try {
            const { orderId } = req.body;

            if (!orderId) {
                return res.status(400).json({ message: 'Order id is required' });
            }

            const order: IOrder | null = await Order.findOne({ id: orderId });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            await order.deleteOne();

            return res.status(200).json({
                message: 'Order deleted successfully'
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

}

export default Controller;
