import mongoose, { Schema, Document } from 'mongoose';

// Define Interfaces & Models
interface IProduct extends Document {
    name: string;
    type: 'fertilizer' | 'seed';
    stock: number;
    status: 'active' | 'inactive';
    createdOn: Date;
    updatedOn: Date;
}

const ProductSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['fertilizer', 'seed'] },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    createdOn: { type: Date, required: true, default: Date.now },
    updatedOn: { type: Date, required: true, default: Date.now }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export {
    IProduct,
    Product
};
