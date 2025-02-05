"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
class Controller {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const newOrder = new schema_1.Order();
                newOrder.product = productId;
                newOrder.quantity = quantity;
                newOrder.farmer = farmerId;
                yield newOrder.save();
                return res.status(201).json({
                    message: "Order is created successfully.",
                    data: newOrder
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    readAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.params;
                const { farmerId } = req.body;
                let orders = [];
                if (type == 'farmers') {
                    if (!farmerId) {
                        return res.status(400).json({ message: 'Farmer id is required' });
                    }
                    orders = yield schema_1.Order.find({ farmer: farmerId });
                }
                if (type == 'all') {
                    orders = yield schema_1.Order.find();
                }
                return res.status(200).json({
                    data: orders
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    readSingleOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                if (!orderId) {
                    return res.status(400).json({ message: 'Order id is required' });
                }
                const order = yield schema_1.Order.findOne({ id: orderId });
                return res.status(200).json({
                    data: order
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const order = yield schema_1.Order.findOne({ id: orderId });
                if (!order) {
                    return res.status(404).json({ message: 'Order not found' });
                }
                order.quantity = quantity;
                order.status = status;
                yield order.save();
                return res.status(200).json({
                    data: order
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                if (!orderId) {
                    return res.status(400).json({ message: 'Order id is required' });
                }
                const order = yield schema_1.Order.findOne({ id: orderId });
                if (!order) {
                    return res.status(404).json({ message: 'Order not found' });
                }
                yield order.deleteOne();
                return res.status(200).json({
                    message: 'Order deleted successfully'
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.default = Controller;
