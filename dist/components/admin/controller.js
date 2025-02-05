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
                const checkAdmin = yield schema_1.Admin.findOne({
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
                const newAdmin = new schema_1.Admin();
                newAdmin.name = name;
                newAdmin.email = email;
                newAdmin.password = yield bcrypt_1.default.hash(password, parseInt(process.env.SALTROUNDS));
                yield newAdmin.save();
                return res.status(201).json({
                    message: "Admin is created successfully.",
                    data: newAdmin
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
                const { email, password } = req.body;
                // check if the provided email or phone exists
                const admin = yield schema_1.Admin.findOne({
                    email
                });
                if (!admin) {
                    return res.status(404).json({
                        message: "No admin found with those credentials",
                        data: null
                    });
                }
                // Compare password
                const isMatch = yield bcrypt_1.default.compare(password, admin.password);
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid password" });
                }
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    data: admin
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.default = Controller;
