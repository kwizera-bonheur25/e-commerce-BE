/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/http.exception";
import { wishValidation } from "../validations/wish.validation";
import { getProductID } from "../utils/controller";

import { ExpandedRequest } from "./auth";
import { read_function } from "../utils/db_methods";
import { ProductAttributes } from "../types/model";
const isValidWish = async (req: Request, res: Response, next: NextFunction) => {
	const { error } = wishValidation.validate(req.body);

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

export const userWishProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const productId = getProductID(req, res) as string;
		if (!productId) {
			return;
		}
		const user = (req as ExpandedRequest).user;
		const userId = user?.id;

		const product = await read_function<ProductAttributes>(
			"Product",
			"findOne",
			{
				where: { id: productId },
			},
		);

		if (!product) {
			return sendResponse(res, 404, "NOT FOUND", "Product doesn't exist");
		}

		if (userId !== product.sellerId) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Product not owned by the seller",
			);
		}

		(req as ExpandedRequest).product = product;
		next();
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			error as Error,
		);
	}
};

export default {
	isValidWish,
	userWishProduct,
};
