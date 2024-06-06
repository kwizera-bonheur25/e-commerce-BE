import express from "express";
import {
	createReview,
	deleteReviews,
	getAllReview,
	updateReviews,
} from "../controllers/review.controller";
import authentication from "../middlewares/auth";
import productMiddlewares from "../middlewares/product.middlewares";
import {
	ReviewOwner,
	isOrderDelivered,
	isReviewAvailable,
	isSalesDelivered,
	reviewValidate,
} from "../middlewares/review.middleware";

const reviewRouter = express.Router();
reviewRouter.get("/", getAllReview);
reviewRouter.post(
	"/",
	authentication.isBuyer,
	productMiddlewares.IdValidated("productId", "ProductId"),
	productMiddlewares.isProductAvailable("productId"),
	isOrderDelivered,
	isSalesDelivered,
	reviewValidate,
	createReview,
);
reviewRouter.patch(
	"/:id",
	authentication.isBuyer,
	productMiddlewares.IdValidated("id", "reviewId"),
	isReviewAvailable("id"),
	ReviewOwner,
	reviewValidate,
	updateReviews,
);

reviewRouter.delete(
	"/:id",
	authentication.isBuyer,
	productMiddlewares.IdValidated("id", "reviewId"),
	isReviewAvailable("id"),
	ReviewOwner,
	deleteReviews,
);
export default reviewRouter;
