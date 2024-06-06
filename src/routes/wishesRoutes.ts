import express from "express";
import wishesController from "../controllers/wishlistController";
import userAuthentication from "../middlewares/auth";
import wishMiddlewares from "../middlewares/wish.middlewares";
const wishesRouter = express.Router();

// create wish
wishesRouter.post(
	"/",
	userAuthentication.isBuyer,
	wishMiddlewares.isValidWish,
	wishesController.createWishlist,
);

// get all wishes
wishesRouter.get(
	"/",
	userAuthentication.authenticateUser,
	wishesController.getWishlist,
);

// get a wish seller only
wishesRouter.get(
	"/:id",
	userAuthentication.isSeller,
	wishMiddlewares.userWishProduct,
	wishesController.getSingleWishlist,
);

export default wishesRouter;
