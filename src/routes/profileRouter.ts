import express from "express";
import userController from "../controllers/userController";
import authenticate from "../middlewares/auth";
import fileUpload from "../middlewares/multer";
import userMiddleware from "../middlewares/user.middleware";

const profileRouter = express.Router();

profileRouter.get(
	"/profile",
	authenticate.authenticateUser,
	userController.read_profile,
);
profileRouter.patch(
	"/profile",
	authenticate.authenticateUser,
	fileUpload.single("profileImage"),
	userMiddleware.validateProfile,
	userController.update_user_profile,
);
export default profileRouter;
