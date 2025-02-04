import mongoose, { Schema, Document } from 'mongoose';

// Define Interfaces & Models
interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
}

const FarmerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Admin = mongoose.model<IAdmin>('Admin', FarmerSchema);

export {
    IAdmin,
    Admin
};
