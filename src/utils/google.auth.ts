// service/authService.ts

import { UserModelAttributes, roleModelAttributes } from "../types/model";
import { read_function, insert_function } from "../utils/db_methods";
import { generateAccessToken } from "../helpers/security.helpers";
import { sendResponse } from "../utils/http.exception";
import { Response } from "express";

export async function handleUserLogin(
	res: Response,
	userExist: UserModelAttributes,
) {
	const role = await read_function<roleModelAttributes>("role", "findOne", {
		where: { id: userExist.role },
	});

	const token = generateAccessToken({
		id: userExist.id,
		role: role.roleName,
	});

	return sendResponse(
		res,
		200,
		"SUCCESS",
		"Logged in to your account successfully!",
		token,
	);
}

export async function handleNewUser(
	res: Response,
	userData: UserModelAttributes,
) {
	const newUser = await insert_function<UserModelAttributes>("User", "create", {
		...userData,
	});

	const role = await read_function<roleModelAttributes>("role", "findOne", {
		where: { id: newUser.role },
	});

	const token = generateAccessToken({
		id: newUser.id,
		role: role.roleName,
	});

	return sendResponse(
		res,
		201,
		"SUCCESS",
		"Account created successfully!",
		token,
	);
}
