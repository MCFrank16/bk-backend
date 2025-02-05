import { Request, Response } from 'express'
import { Order, IOrder } from "./schema";

class Controller {

    async create(req: Request, res: Response): Promise<any> {
        try {
            const { productId, quantity, farmerId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product id is required.' });
            }

            if (!quantity) {
                return res.status(400).json({ message: 'Quantity is required.' });
            }


            if (!farmerId) {
                return res.status(400).json({ message: 'Farmer id is required.' });
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
            const { id } = req.query;

            let orders: IOrder[] = [];

            if (id) {
                orders = await Order.find({ farmer: id })
                    .populate('product')
                    .populate('farmer');
            }


            if (!id) {
                orders = await Order.find()
                    .populate('product')
                    .populate('farmer');
            }

            return res.status(200).json({
                message: "Orders retrieved successfully.",
                data: orders
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async readSingleOrder(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'Order id is required' });
            }

            const order: IOrder | null = await Order.findOne({ id });

            return res.status(200).json({
                message: "Order retrieved successfully.",
                data: order
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async updateOrder(req: Request, res: Response): Promise<any> {
        try {

            const { id } = req.params;

            const { status, quantity } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'Order id is required' });
            }

            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }

            if (!quantity) {
                return res.status(400).json({ message: 'Quantity is required' });
            }

            const order: IOrder | null = await Order.findOne({ _id: id });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.quantity = quantity;
            order.status = status;

            await order.save();

            return res.status(200).json({
                message: "Order updated successfully.",
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
                message: 'Order deleted successfully.'
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

}

export default Controller;
