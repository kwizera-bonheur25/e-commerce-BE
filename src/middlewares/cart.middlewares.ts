import { Request, Response, NextFunction } from "express";
import validateCart from "../validations/cart.validation";
import { sendResponse } from "../utils/http.exception";

const isCartValidated = (req: Request, res: Response, next: NextFunction) => {
	const { error } = validateCart(req.body);
	if (error) {
		return sendResponse(
			res,
			400,
			"Error",
			error.details[0].message.replace(/"/g, ""),
		);
	}

	try {
		next();
	} catch (err) {
		return sendResponse(res, 500, "Server error", `Message:${err}`);
	}
};

export default isCartValidated;
