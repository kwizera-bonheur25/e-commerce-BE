import salesValidate from "../validations/sales.validation";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/http.exception";

export const orderSalesValid = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const error = salesValidate(req.body);

	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/"/g, ""),
		);
	}

	next();
};

export default orderSalesValid;
