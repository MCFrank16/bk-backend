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
        controller.readAll.bind(controller),
    );

router
    .route("/read/:id")
    .get(
        controller.readSingle.bind(controller),
    );

router
    .route("/update/:id")
    .put(
        controller.updateProduct.bind(controller),
    );

router
    .route("/delete/:id")
    .delete(
        controller.deleteProduct.bind(controller),
    );

export default router;
