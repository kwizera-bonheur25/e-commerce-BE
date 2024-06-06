import express from "express";
import userController from "../controllers/userController";
import userMiddleware from "../middlewares/user.middleware";
import otpIsValid from "../middlewares/otp";
import { resetPasswort, forgotPassword } from "../controllers/resetPasswort";
import authentication from "../middlewares/auth";

const userRoutes = express.Router();
userRoutes.post(
	"/register",
	userMiddleware.userValid,
	userController.registerUser,
);

userRoutes.post(
	"/login",
	userMiddleware.logInValidated,
	userMiddleware.checkAccountStatus,
	userController.login,
);

userRoutes.post(
	"/forgot-password",
	userMiddleware.resetValidated,
	forgotPassword,
);
userRoutes.post(
	"/reset-password/:token",
	userMiddleware.isPassword,
	resetPasswort,
);
userRoutes.patch(
	"/password-update",
	authentication.is_authenticated_when_password_expired,
	userMiddleware.isUpdatePassValid,
	userController.updatePassword,
);
userRoutes.get("/", authentication.isAdmin, userController.allUsers);
userRoutes.patch(
	"/:userId/account-status",
	authentication.isAdmin,
	userMiddleware.accountStatusValid,
	userController.accountStatus,
);
userRoutes.get("/account/verify/:token", userController.accountVerify);
userRoutes.post(
	"/logout",
	authentication.authenticateUser,
	userController.logout,
);
userRoutes.get("/account/verify/:token", userController.accountVerify);

userRoutes.post(
	"/2fa/:token",
	otpIsValid,
	userController.two_factor_authentication,
);
userRoutes.get("/auth/google", userController.googleAuthInit);

userRoutes.get("/auth/google/callback", userController.handleGoogleAuth);

export default userRoutes;
