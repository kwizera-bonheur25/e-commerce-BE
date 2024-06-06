import { Request, Response, NextFunction } from "express";
import { Order } from "../database/models/order";
import { Sales } from "../database/models/sales";
import { EventName, myEmitter } from "../utils/nodeEvents";

export const updateOrderStatusMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		const sale = await Sales.findOne({ where: { id } });

		if (!sale) {
			return res.status(404).json({
				status: "NOT FOUND",
				message: "Sale not found",
			});
		}
		const orderSales = await Sales.findAll({
			where: { orderId: sale.orderId },
		});

		const allAproved = orderSales.every(
			(orderSale) => orderSale.status === "delivered",
		);
		const anyRejected = orderSales.some(
			(orderSale) => orderSale.status === "canceled",
		);

		const order = await Order.findByPk(sale?.orderId);

		if (order && allAproved) {
			order?.update({ status: "delivered" });
			myEmitter.emit(EventName.ORDERS_DELIVERED, order);
		}
		if (order && anyRejected) {
			order?.update({ status: "canceled" });
			myEmitter.emit(EventName.ORDERS_CANCELED, order);
		}

		next();
	} catch (error) {
		return res.status(500).json({
			status: "SERVER ERROR",
			message: "Something went wrong!",
			error: (error as Error).message,
		});
	}
};
