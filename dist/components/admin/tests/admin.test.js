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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const controller_1 = __importDefault(require("../controller"));
const schema_1 = require("../schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const controller = new controller_1.default();
app.post('/admin/create', controller.create.bind(controller));
app.get('/admin/login', controller.login.bind(controller));
jest.mock('../schema');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
describe('Admin Controller', () => {
    describe('POST /admin/create', () => {
        it('should create a new admin', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Admin.findOne.mockResolvedValue(null);
            schema_1.Admin.prototype.save.mockResolvedValue({});
            bcrypt_1.default.hash.mockResolvedValue('hashedpassword');
            const newAdmin = {
                email: 'adminUser@gmail.com',
                password: 'adminPass123',
                name: 'super admin',
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/admin/create')
                .send(newAdmin);
            expect(response.status).toBe(201);
        }));
        it('should return 400 if details are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAdmin = {
                password: 'adminPass123',
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/admin/create')
                .send(newAdmin);
            expect(response.status).toBe(400);
        }));
    });
    describe('GET /admin/login', () => {
        it('should login an admin successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Admin.findOne.mockResolvedValue({
                email: 'adminUser@gmail.com',
                password: 'hashedpassword',
            });
            bcrypt_1.default.compare.mockResolvedValue(true);
            jsonwebtoken_1.default.sign.mockReturnValue('fake-jwt-token');
            const response = yield (0, supertest_1.default)(app)
                .get('/admin/login')
                .query({ email: 'adminUser@gmail.com', password: 'password' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBe('fake-jwt-token');
        }));
        it('should return 404 if admin is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Admin.findOne.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .get('/admin/login')
                .query({ email: 'adminUser@gmail.com', password: 'password' });
            expect(response.status).toBe(404);
        }));
        it('should return 500 if there is a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Admin.findOne.mockRejectedValue(new Error('Server error'));
            const response = yield (0, supertest_1.default)(app)
                .get('/admin/login')
                .query({ email: 'adminUser@gmail.com', password: 'password' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        }));
    });
});
