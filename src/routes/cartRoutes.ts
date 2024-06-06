import express from "express";
import auth from "../middlewares/auth";
import {
	addItemToCart,
	viewCart,
	clearCart,
	updateCart,
} from "../controllers/cartController";
import isCartValidated from "../middlewares/cart.middlewares";
import { isProductExist } from "../middlewares/product.middlewares";

const cartRouter = express.Router();

cartRouter.post(
	"/",
	auth.authenticateUser,
	auth.isBuyer,
	isCartValidated,
	isProductExist,
	addItemToCart,
);
cartRouter.get("/", auth.authenticateUser, auth.isBuyer, viewCart);
cartRouter.put("/", auth.authenticateUser, auth.isBuyer, clearCart);
cartRouter.patch(
	"/",
	auth.authenticateUser,
	auth.isBuyer,
	isProductExist,
	updateCart,
);
export default cartRouter;
