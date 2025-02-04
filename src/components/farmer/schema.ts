import mongoose, { Schema, Document } from 'mongoose';

// Define Interfaces & Models
interface IFarmer extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    land: {
        size: number, // in acres only
        location: string,

    };
}

const FarmerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    land: { type: Object, required: true }
});

const Farmer = mongoose.model<IFarmer>('Farmer', FarmerSchema);

export {
    IFarmer,
    Farmer
};
