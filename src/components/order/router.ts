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
    .route("/")
    .get(
        controller.readAllOrders.bind(controller),
    );

router
    .route("/read/:id")
    .get(
        controller.readSingleOrder.bind(controller),
    );

router
    .route("/update/:id")
    .put(
        controller.updateOrder.bind(controller),
    );

router
    .route("/delete/:id")
    .delete(
        controller.deleteOrder.bind(controller),
    );

export default router;
