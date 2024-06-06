import express from "express";
import salesController from "../controllers/salesController";
import authentication from "../middlewares/auth";
import orderSalesValid from "../middlewares/salesMiddleware";

const salesRoutes = express.Router();

salesRoutes.get(
	"/",
	authentication.authenticateUser,
	authentication.isSeller,
	salesController.allSales,
);

salesRoutes.get(
	"/:id",
	authentication.authenticateUser,
	authentication.isSeller,
	salesController.singleSale,
);

salesRoutes.patch(
	"/:id/status",
	authentication.authenticateUser,
	authentication.isSeller,
	orderSalesValid,
	salesController.updateOrderStatus,
);

export default salesRoutes;
