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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Controller {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, phone, password, name, landDetails } = req.body;
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
                if (!landDetails) {
                    return res.status(400).json({
                        message: "Land details are required",
                        data: null
                    });
                }
                // check if the provided email or phone exists already
                const checkFarmer = yield schema_1.Farmer.findOne({
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
                const newFarmer = new schema_1.Farmer();
                newFarmer.name = name;
                newFarmer.email = email;
                newFarmer.password = yield bcrypt_1.default.hash(password, parseInt(process.env.SALTROUNDS));
                newFarmer.phone = phone;
                newFarmer.land = {
                    size: landDetails["size"],
                    location: landDetails["location"]
                };
                yield newFarmer.save();
                return res.status(201).json({
                    message: "Farmer is created successfully.",
                    data: newFarmer
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                // check if the provided email or phone exists
                const farmer = yield schema_1.Farmer.findOne({
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
                const isMatch = yield bcrypt_1.default.compare(password, farmer.password);
                if (!isMatch) {
                    return res.status(400).json({ message: "Invalid password" });
                }
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ id: farmer._id, email: farmer.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
                return res.status(200).json({
                    message: "Login successful",
                    token
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.default = Controller;
