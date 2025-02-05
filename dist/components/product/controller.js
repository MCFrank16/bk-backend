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
                const { name, type, stock } = req.body;
                if (!name) {
                    return res.status(400).json({ message: 'Name is required' });
                }
                if (!type) {
                    return res.status(400).json({ message: 'Type is required' });
                }
                if (!stock) {
                    return res.status(400).json({ message: 'Stock is required' });
                }
                const newProduct = new schema_1.Product();
                newProduct.name = name;
                newProduct.type = type;
                newProduct.stock = parseInt(stock);
                yield newProduct.save();
                return res.status(200).json({
                    message: "Product is created successfully.",
                    data: newProduct
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    readAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield schema_1.Product.find();
                return res.status(200).json({
                    message: "Product retrieved successfully.",
                    data: products
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    readSingle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield schema_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found.",
                        data: null
                    });
                }
                return res.status(200).json({
                    message: "Product found.",
                    data: product
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, type } = req.body;
                const product = yield schema_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found.",
                        data: null
                    });
                }
                product.name = name;
                product.type = type;
                yield product.save();
                return res.status(200).json({
                    message: "Product updated successfully.",
                    data: product
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield schema_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found.",
                        data: null
                    });
                }
                yield product.deleteOne();
                return res.status(200).json({
                    message: "Product deleted successfully.",
                    data: null
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.default = Controller;
