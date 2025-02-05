import express from "express";
import Controller from "./controller";

const router = express();
const controller = new Controller();

router
    .route("/create")
    .post(
        controller.create.bind(controller),
    );

router
    .route("/login")
    .post(
        controller.login.bind(controller),
    );

export default router;
