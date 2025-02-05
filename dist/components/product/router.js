"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const router = (0, express_1.default)();
const controller = new controller_1.default();
router
    .route("/create")
    .post(controller.create.bind(controller));
router
    .route("/")
    .get(controller.readAll.bind(controller));
router
    .route("/read/:id")
    .get(controller.readSingle.bind(controller));
router
    .route("/update/:id")
    .put(controller.updateProduct.bind(controller));
router
    .route("/delete/:id")
    .delete(controller.deleteProduct.bind(controller));
exports.default = router;
