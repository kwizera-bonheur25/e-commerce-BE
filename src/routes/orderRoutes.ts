import express from "express";
import orderController from "../controllers/orderController";
import authentication from "../middlewares/auth";

const orderRoutes = express.Router();

orderRoutes.get(
	"/",
	authentication.authenticateUser,
	authentication.isBuyer,
	orderController.getOrders,
);

orderRoutes.get(
	"/:id",
	authentication.authenticateUser,
	authentication.isBuyer,
	orderController.getSingleOrder,
);

export default orderRoutes;
