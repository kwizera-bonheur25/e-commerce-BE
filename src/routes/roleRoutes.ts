import {
	createRole,
	assignRole,
	updateRole,
	allRole,
} from "../controllers/roleController";
import express from "express";
import {
	roleNameValid,
	roleIdValidations,
} from "../middlewares/role.middleware";
import authentication from "../middlewares/auth";
export const roleRoutes = express.Router();

roleRoutes.get("/roles/", authentication.isAdmin, allRole);
roleRoutes.post("/roles/", authentication.isAdmin, roleNameValid, createRole);
roleRoutes.post(
	"/users/:userId/roles",
	authentication.isAdmin,
	roleIdValidations,
	assignRole,
);
roleRoutes.patch(
	"/roles/:id",
	authentication.isAdmin,
	roleNameValid,
	updateRole,
);
