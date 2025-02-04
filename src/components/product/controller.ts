import { Request, Response } from 'express'
import { Product, IProduct } from "./schema";

class Controller {

    async create(req: Request, res: Response): Promise<any> {

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

            const newProduct = new Product();

            newProduct.name = name;
            newProduct.type = type;
            newProduct.stock = parseInt(stock);

            await newProduct.save();

            return res.status(200).json({
                message: "Product is created successfully.",
                data: newProduct
            });

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async readAll(req: Request, res: Response): Promise<any> {

        try {

            const products: IProduct[] = await Product.find();

            return res.status(200).json({
                message: "Product retrieved successfully.",
                data: products
            });

        } catch (error: any) {
            return res.status(500).json({ message: "Server error" });
        }
    }

    async readSingle(req: Request, res: Response): Promise<any> {

        try {

            const product: IProduct | null = await Product.findById(req.params.id);

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

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<any> {

        try {

            const { name, type } = req.body;

            const product: IProduct | null = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found.",
                    data: null
                });
            }

            product.name = name;
            product.type = type;

            await product.save();

            return res.status(200).json({
                message: "Product updated successfully.",
                data: product
            });

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<any> {

        try {

            const product: IProduct | null = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found.",
                    data: null
                });
            }

            await product.deleteOne();

            return res.status(200).json({
                message: "Product deleted successfully.",
                data: null
            });

        } catch (error: any) {
            return res.status(500).json({ message: "Server error" });
        }
    }
}

export default Controller;
