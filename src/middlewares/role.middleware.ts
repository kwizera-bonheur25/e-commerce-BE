/* eslint-disable no-useless-escape */
import {
	validateNewRole,
	validateRoleID,
} from "../validations/role.validation";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/http.exception";

export const roleNameValid = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body) {
			const error = validateNewRole(req.body);
			if (error) {
				return sendResponse(
					res,
					400,
					"BAD REQUEST",
					error.details[0].message.replace(/"/g, " "),
				);
			}
		}
		next();
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

export const roleIdValidations = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body) {
			const error = validateRoleID(req.body);
			if (error) {
				return sendResponse(
					res,
					400,
					"BAD REQUEST",
					error.details[0].message.replace(/"/g, " "),
				);
			}
		}
		next();
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};
