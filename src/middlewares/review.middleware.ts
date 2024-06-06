import { NextFunction, Response } from "express";
import { validateReview } from "../validations/review.validations";
import { ExpandedRequest } from "./auth";
import { sendResponse } from "../utils/http.exception";
import database_models from "../database/config/db.config";
/* eslint-disable no-useless-escape */
export const reviewValidate = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const error = validateReview(req.body);
	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/\"/g, ""),
		);
	}
	next();
};

export const isReviewAvailable = (field: string) => {
	return async (req: ExpandedRequest, res: Response, next: NextFunction) => {
		try {
			const id = req.body[field] || req.params[field];
			const review = await database_models.review.findOne({
				where: { id },
			});
			if (!review) {
				return sendResponse(res, 404, "BAD REQUEST", "Review not found!");
			}
			req.review = review;
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

export const ReviewOwner = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const reviweId = req.review;
		const user = req.user;

		if (reviweId?.userId !== user?.id) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Only Owner can perform this action!",
			);
		}

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

export const isOrderDelivered = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const buyerId = req.user?.id;
		const orderDone = await database_models.Order.findOne({
			where: { buyerId, status: "delivered" },
		});

		if (!orderDone) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Failed due order is not delivered!",
			);
		}
		req.order = orderDone;
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

export const isSalesDelivered = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const buyerId = req.user?.id;
		//const orderDone = req.order;
		const productId = req.product?.id;
		const salesDone = await database_models.Sales.findOne({
			where: {
				productId,
				status: "delivered",
				buyerId,
			},
		});
		if (!salesDone) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Failed due user  is not the one who made an order!",
			);
		}
		req.sales = salesDone;
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
