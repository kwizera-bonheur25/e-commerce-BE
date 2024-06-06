import express from "express";
import paymentController from "../controllers/paymentController";
import userAuthentication from "../middlewares/auth";
import paymentMiddlewares from "../middlewares/payments.middlewares";

const paymentRouter = express.Router();

paymentRouter.post(
	"/",
	userAuthentication.isBuyer,
	paymentMiddlewares.paymentMethods(["stripe", "momo"]),
	paymentMiddlewares.userHasCart,
	paymentMiddlewares.cartHasProducts,
	paymentMiddlewares.TAMOUNT_NOTBELOW(600),
	paymentMiddlewares.validMomo,
	paymentMiddlewares.requestToPay,
	paymentController.create_checkout_session,
);
paymentRouter.get("/success", paymentController.checkout_success);
paymentRouter.post("/cancel", paymentController.checkout_cancel);

export default paymentRouter;
