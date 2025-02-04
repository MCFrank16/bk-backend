import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    farmer: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    status: 'pending' | 'approved' | 'rejected';
}
const OrderSchema = new Schema({
    farmer: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export {
    IOrder,
    Order
}
