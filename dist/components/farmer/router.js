"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = __importDefault(require("./controllers"));
const router = (0, express_1.default)();
const controller = new controllers_1.default();
router
    .route("/create")
    .post(controller.create.bind(controller));
router
    .route("/login")
    .get(controller.login.bind(controller));
exports.default = router;
