import express from "express";
import userAuthentication from "../middlewares/auth";
import categoryController from "../controllers/categoryController";

const categoryRouter = express.Router();

categoryRouter.post(
	"/",
	userAuthentication.isSeller,
	categoryController.add_category,
);
categoryRouter.get("/", categoryController.read_all_categories);
categoryRouter.get("/:id", categoryController.read_single_category);
categoryRouter.patch(
	"/:id",
	userAuthentication.isSeller,
	categoryController.update_category,
);

export default categoryRouter;
