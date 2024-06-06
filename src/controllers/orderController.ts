import { Request, Response } from "express";
import { ExpandedRequest } from "../middlewares/auth";
import { sendResponse } from "../utils/http.exception";
import { Order } from "../database/models/order";
import { Sales } from "../database/models/sales";

const getOrders = async (req: Request, res: Response) => {
	try {
		const user = (req as unknown as ExpandedRequest).user;
		const userId = user?.id;

		const orders = await Order.findAll({
			where: { buyerId: userId },
			include: [{ model: Sales, as: "sales" }],
		});

		return sendResponse(
			res,
			200,
			"SUCCESS",
			"Orders retrieved successfully",
			orders,
		);
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

const getSingleOrder = async (req: Request, res: Response) => {
	try {
		const user = (req as unknown as ExpandedRequest).user;
		const userId = user?.id;

		const { id } = req.params;

		const order = await Order.findOne({
			where: { id, buyerId: userId },
			include: [{ model: Sales, as: "sales" }],
		});

		if (!order) {
			return sendResponse(res, 404, "NOT FOUND", "Order not found");
		}

		return sendResponse(
			res,
			200,
			"SUCCESS",
			"Order retrieved Successfully!",
			order,
		);
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went Wrong!",
			(error as Error).message,
		);
	}
};

export default { getOrders, getSingleOrder };
