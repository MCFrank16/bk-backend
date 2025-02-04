import { Request, Response } from 'express'
import { Admin, IAdmin } from "./schema";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

class Controller {

    async create(req: Request, res: Response): Promise<any> {

        try {
            const { email, password, name } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            if (!password) {
                return res.status(400).json({ message: 'Quantity is required' });
            }


            if (!name) {
                return res.status(400).json({ message: 'Farmer id is required' });
            }


            // check if the provided email or phone exists already

            const checkAdmin: IAdmin | null = await Admin.findOne({
                $or: [
                    { email },
                ]
            });

            if (checkAdmin) {

                return res.status(400).json({
                    message: "Email already exist",
                    data: null
                });
            }

            const newAdmin = new Admin();

            newAdmin.name = name;
            newAdmin.email = email;
            newAdmin.password = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS as string));

            await newAdmin.save();

            return res.status(201).json({
                message: "Admin is created successfully.",
                data: newAdmin
            });

        } catch (error: any) {
            return res.status(500).json({ message: "Server error" });
        }
    }

    async login(req: Request, res: Response): Promise<any> {

        try {

            const { email, password } = req.body;

            // check if the provided email or phone exists
            const admin: IAdmin | null = await Admin.findOne({
                email
            });

            if (!admin) {
                return res.status(404).json({
                    message: "No admin found with those credentials",
                    data: null
                });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: admin._id, email: admin.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );


            return res.status(200).json({
                message: "Login successful",
                token,
                data: admin
            });


        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }

    }
}

export default Controller;
