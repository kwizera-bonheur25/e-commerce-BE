import { NextFunction, Request, Response } from "express";
import { searchValidate } from "../validations/search.validitions";
import { sendResponse } from "../utils/http.exception";

export const searchMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.query) {
			const { error } = searchValidate(req.query);
			if (error) {
				return sendResponse(
					res,
					400,
					"BAD REQUEST",
					error.details[0].message.replace(/"/g, ""),
				);
			}
		}
		next();
	} catch (error) {
		res.status(500).json({
			status: "SERVER FAIL",
			message: "Something went wrong!!",
			error: error,
		});
	}
};
