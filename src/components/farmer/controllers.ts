import { Request, Response } from 'express'
import { Farmer, IFarmer } from "./schema";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

class Controller {

    async create(req: Request, res: Response): Promise<any> {

        try {
            const { email, phone, password, name } = req.body;

            if (!email) {
                return res.status(400).json({
                    message: "Email is required",
                    data: null
                });
            }

            if (!phone) {
                return res.status(400).json({
                    message: "Phone is required",
                    data: null
                });
            }

            if (!password) {
                return res.status(400).json({
                    message: "Password is required",
                    data: null
                });
            }

            if (!name) {
                return res.status(400).json({
                    message: "Name is required",
                    data: null
                });
            }

            // check if the provided email or phone exists already

            const checkFarmer: IFarmer | null = await Farmer.findOne({
                $or: [
                    { email },
                    { phone }
                ]
            });

            if (checkFarmer) {

                return res.status(400).json({
                    message: "Email or phone already exist",
                    data: null
                });
            }

            const newFarmer = new Farmer();

            newFarmer.name = name;
            newFarmer.email = email;
            newFarmer.password = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS as string));
            newFarmer.phone = phone;
            // newFarmer.land = {
            //     size: landDetails["size"],
            //     location: landDetails["location"]
            // }

            await newFarmer.save();

            return res.status(201).json({
                message: "Farmer is created successfully.",
                data: newFarmer
            });

        } catch (error: any) {
            return res.status(500).json({ message: "Server error" });
        }
    }

    async login(req: Request, res: Response): Promise<any> {

        try {

            const { username, password } = req.body;

            // check if the provided email or phone exists
            const farmer: IFarmer | null = await Farmer.findOne({
                $or: [
                    { email: username },
                    { phone: username }
                ]
            });

            if (!farmer) {
                return res.status(404).json({
                    message: "No farmer found with those credentials",
                    data: null
                });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, farmer.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: farmer._id, email: farmer.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            const { password: pwd, ...data } = farmer.toObject();


            return res.status(200).json({
                message: "Login successful",
                token,
                data
            });


        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }

    }

    async updateFarmer(req: Request, res: Response): Promise<any> {
        
        try {

            const { id: farmerId } = req.params;

            const { name, landDetails } = req.body;

            if (!farmerId) {
                return res.status(400).json({ message: 'Farmer id is required' });
            }

            const farmer: IFarmer | null = await Farmer.findOne({ _id: farmerId });

            if (!farmer) {
                return res.status(404).json({ message: 'Farmer not found' });
            }

            if (name) {
                farmer.name = name;
            }


            if (landDetails) {
                farmer.land = {
                    size: landDetails["size"],
                    location: landDetails["location"],
                    type: landDetails["type"]
                }
            }

            await farmer.save();

            const { password: pwd, ...data } = farmer.toObject();

            return res.status(200).json({
                message: "Farmer updated successfully.",
                data
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error" });
        }
    }
}

export default Controller;
