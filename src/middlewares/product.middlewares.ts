/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from "express";
import { productValidation } from "../validations/product.validation";
import { sendResponse } from "../utils/http.exception";
import database_models from "../database/config/db.config";
import { validate } from "uuid";
import { validateuuid } from "../utils/validateuuid";
import { ExpandedRequest } from "./auth";
import { Op } from "sequelize";
import { isAvailable } from "../utils/nodeEvents";
const isValidProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = productValidation.validate(req.body);
	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/\"/g, "") == "images is required"
				? "Images are required"
				: error.details[0].message.replace(/\"/g, ""),
		);
	}
	next();
};
export const isProductExist = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { productId, quantity } = req.body;

	if (!validate(productId)) {
		return sendResponse(res, 400, "BAD REQUEST", "Invalid product id");
	}

	const product = await database_models.Product.findOne({
		where: { id: productId },
	});

	if (!product) {
		return sendResponse(res, 404, "NOT FOUND", "product is not found");
	}
	if (!product?.dataValues.isAvailable) {
		return sendResponse(res, 403, "FORBIDDEN", "product is not available");
	}
	if (product.dataValues.quantity < quantity) {
		return sendResponse(res, 404, "NOT FOUND", "Not enough quantity in stock");
	}
	next();
};

const IdValidated = (field: string, idName: string) => {
	return async (req: ExpandedRequest, res: Response, next: NextFunction) => {
		const uuid = req.body[field] || req.params[field];
		if (!uuid) {
			return sendResponse(res, 400, "BAD REQUEST", `${idName} is required`);
		}
		const isValid = validateuuid(uuid);
		if (!isValid) {
			return sendResponse(res, 400, "BAD REQUEST", `${idName} must be UUID V4`);
		}
		next();
	};
};

const isProductAvailable = (field: string) => {
	return async (req: ExpandedRequest, res: Response, next: NextFunction) => {
		try {
			const productId = req.body[field] || req.params[field];
			const product = await database_models.Product.findOne({
				where: {
					id: productId,
					isAvailable,
					expiryDate: {
						[Op.gt]: new Date(),
					},
				},
				include: [
					{
						model: database_models.User,
						as: "seller",
					},
				],
			});

			if (!product) {
				return sendResponse(res, 404, "BAD REQUEST", "product not found!");
			}

			req.product = product;
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
};

export default {
	isValidProduct,
	isProductAvailable,
	IdValidated,
};
