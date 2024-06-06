import EventEmitter from "events";
import { join } from "node:path";
import { Request, Response } from "express";

export const myEmitter = new EventEmitter();

export const EventName = {
	PRODUCT_GOT_EXPIRED: "PRODUCT_GOT_EXPIRED",
	PRODUCT_ADDED_TO_WISHLIST: "PRODUCT_ADDED_TO_WISHLIST",
	PRODUCT_REMOVED_FROM_WISHLIST: "PRODUCT_REMOVED_FROM_WISHLIST",
	PRRODUCT_BOUGHT: "PRODUCT_BOUGHT",
	ORDER_PENDING: "ORDER_PENDING",
	ORDERS_DELIVERED: "ORDERS_DELIVERED",
	ORDERS_CANCELED: "ORDERS_CANCELED",
};

export const notificationPage = async (req: Request, res: Response) => {
	res.sendFile(join(__dirname, "../../public/notification.html"));
};
export const notificationLogin = async (req: Request, res: Response) => {
	res.sendFile(join(__dirname, "../../public/signin.html"));
};

export const isAvailable = true;
