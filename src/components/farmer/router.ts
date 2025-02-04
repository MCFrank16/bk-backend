import express from "express";
import Controller from "./controllers";

const router = express();
const controller = new Controller();

router
    .route("/create")
    .post(
        controller.create.bind(controller),
    );

router
    .route("/login")
    .get(
        controller.login.bind(controller),
    );

export default router;
