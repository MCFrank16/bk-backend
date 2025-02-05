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
app.post('/order/create', controller.create.bind(controller));
app.get('/order/', controller.readAllOrders.bind(controller));
app.get('/order/read/:id', controller.readSingleOrder.bind(controller));
app.put('/order/update/:id', controller.updateOrder.bind(controller));
app.delete('/order/delete/:id', controller.deleteOrder.bind(controller));
jest.mock('../schema');
describe('Order Controller', () => {
    it('should create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
        schema_1.Order.prototype.save.mockResolvedValue({ productId: '1', farmerId: '1', quantity: 1 });
        const response = yield (0, supertest_1.default)(app)
            .post('/order/create')
            .send({
            productId: '123',
            farmerId: '123',
            quantity: 2,
        });
        console.log(response.body);
        expect(response.status).toBe(201);
    }));
});
