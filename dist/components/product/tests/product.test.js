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
const controller_1 = __importDefault(require("../controller"));
const schema_1 = require("../schema");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const controller = new controller_1.default();
app.post('/product/create', controller.create.bind(controller));
app.get('/product/', controller.readAll.bind(controller));
app.get('/product/read/:id', controller.readSingle.bind(controller));
app.put('/product/update/:id', controller.updateProduct.bind(controller));
app.delete('/product/delete/:id', controller.deleteProduct.bind(controller));
jest.mock('../schema');
describe('Product Controller', () => {
    it('should create a new product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        schema_1.Product.prototype.save.mockResolvedValue({ name: 'Test Product', type: 'Test Type', stock: 100 });
        const response = yield (0, supertest_1.default)(app)
            .post('/product/create')
            .send({ name: 'Test Product', type: 'Test Type', stock: 100 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product is created successfully.');
        // expect(response.body.data).toEqual(expect.objectContaining({ name: 'Test Product', type: 'Test Type' }));
    }));
    it('should return 400 if name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/product/create')
            .send({ type: 'Test Type' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
    }));
    it('should return 400 if type is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/product/create')
            .send({ name: 'Test Product' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Type is required');
    }));
    it('should return 500 if there is a server error', () => __awaiter(void 0, void 0, void 0, function* () {
        schema_1.Product.prototype.save.mockRejectedValue(new Error('Server error'));
        const response = yield (0, supertest_1.default)(app)
            .post('/product/create')
            .send({ name: 'Test Product', type: 'Test Type', stock: 100 });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    }));
    describe('readAll', () => {
        it('should return all products successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProducts = [
                { _id: '1', name: 'Product 1', type: 'Type 1' },
                { _id: '2', name: 'Product 2', type: 'Type 2' },
            ];
            schema_1.Product.find.mockResolvedValue(mockProducts);
            const response = yield (0, supertest_1.default)(app).get('/product/');
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockProducts);
        }));
        it('should return 500 if there is a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Product.find.mockRejectedValue(new Error('Server error'));
            const response = yield (0, supertest_1.default)(app).get('/product/');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        }));
    });
    describe('readSingle', () => {
        it('should return a single product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProduct = { _id: '1', name: 'Product 1', type: 'Type 1' };
            schema_1.Product.findById.mockResolvedValue(mockProduct);
            const response = yield (0, supertest_1.default)(app).get('/product/read/1');
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockProduct);
        }));
        it('should return 404 if product is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Product.findById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app).get('/product/read/1');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Product not found.');
        }));
        it('should return 500 if there is a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            schema_1.Product.findById.mockRejectedValue(new Error('Server error'));
            const response = yield (0, supertest_1.default)(app).get('/product/read/1');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        }));
    });
});
