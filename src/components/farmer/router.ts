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
    .post(
        controller.login.bind(controller),
    );

router
    .route("/update/:id")
    .put(
        controller.updateFarmer.bind(controller),
    );

export default router;
