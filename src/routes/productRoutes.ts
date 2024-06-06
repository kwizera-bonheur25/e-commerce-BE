import express from "express";
import userAuthentication from "../middlewares/auth";
import productController from "../controllers/productController";
import productMiddlewares from "../middlewares/product.middlewares";
import fileUpload from "../middlewares/multer";
import searchProduct from "../controllers/searchProduct";
import { searchMiddleware } from "../middlewares/search.middleware";
import { getReviewsOnProduct } from "../controllers/review.controller";

const productRouter = express.Router();

productRouter.get("/search", searchMiddleware, searchProduct.search_product);

productRouter.post(
	"/",
	userAuthentication.isSeller,
	fileUpload.array("images"),
	productMiddlewares.isValidProduct,
	productController.create_product,
);

productRouter.get(
	"/",
	userAuthentication.authenticateUser,
	productController.read_all_products,
);

productRouter.get(
	"/:id",
	userAuthentication.authenticateUser,
	productController.read_single_product,
);

productRouter.patch(
	"/:id",
	userAuthentication.isSeller,
	fileUpload.array("images"),
	productController.update_product,
);
productRouter.patch(
	"/:id/availability-status",
	userAuthentication.isSeller,
	productController.update_product_status,
);

productRouter.delete(
	"/:id",
	userAuthentication.isSeller,
	productController.delete_product,
);
productRouter.get(
	"/:id/reviews/",
	productMiddlewares.IdValidated("id", "reviewId"),
	productMiddlewares.isProductAvailable("id"),
	getReviewsOnProduct,
);
export default productRouter;
