import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { findUserCartById, generateUUID } from "../services/payment.services";
import { cartItem } from "../types/cart";
import { PaymentsModelAttributes } from "../types/model";
import {
	CartRequest,
	MomoInfo,
	TransactionRequest,
	transactionDataTypes,
} from "../types/payment";
import { read_function } from "../utils/db_methods";
import { sendResponse } from "../utils/http.exception";
import {
	MTN_MOMO_CURRENCY,
	MTN_MOMO_REQUEST_PAYMENT_URL,
	MTN_MOMO_SUBSCRIPTION_KEY,
	MTN_MOMO_TARGET_ENVIRONMENT,
} from "../utils/keys";
import { getToken } from "../utils/momoMethods";
import { momoValidation } from "../validations/momo.payments.validate";
import { ExpandedRequest } from "./auth";

const paymentMethods = (methods: Array<string>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { method } = req.query;
		if (!methods.includes(method as string)) {
			return sendResponse(
				res,
				402,
				"PAYMENT REQUIRED",
				"Invalid payment method! I recommend you to use stripe or momo here!",
			);
		}
		next();
	};
};

const userHasCart = async (req: Request, res: Response, next: NextFunction) => {
	const loggedUser = (req as ExpandedRequest).user;
	const cart = await findUserCartById(loggedUser?.id);
	if (!cart) {
		return sendResponse(
			res,
			404,
			"NOT FOUND",
			"No cart found! Try adding some products in the cart.",
		);
	}
	(req as CartRequest).cart = cart;
	next();
};

const cartHasProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const cart = (req as CartRequest).cart;
	const products: cartItem[] = cart.products;
	if (products.length < 1) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			"You can't pay an empty cart! Please add some products!",
		);
	}
	next();
};

const TAMOUNT_NOTBELOW = (lessAmount: number = 500) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const cart = (req as CartRequest).cart;
		if (cart.total < lessAmount) {
			return sendResponse(
				res,
				400,
				"BAD REQUEST",
				`Cart total amount can't be below ${lessAmount} rwf!`,
			);
		}
		next();
	};
};
const validMomo = async (req: Request, res: Response, next: NextFunction) => {
	if (req.query.method === "momo") {
		const { error } = momoValidation.validate(req.body.phoneNumber);
		if (error) {
			return sendResponse(
				res,
				400,
				"BAD REQUEST",
				error.details[0].message.replace(/"/g, ""),
			);
		}
		return next();
	}
	next();
};

const requestToPay = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (req.query.method === "momo") {
		const cart = (req as CartRequest).cart;

		const { phoneNumber } = req.body;

		const url = `${MTN_MOMO_REQUEST_PAYMENT_URL}`;
		const target = MTN_MOMO_TARGET_ENVIRONMENT;
		const subscriptionKey = MTN_MOMO_SUBSCRIPTION_KEY;
		const token = await getToken();

		const transactionData: transactionDataTypes = {
			token,
			targetEnvironment: target,
			subscriptionKey: "*******************************",
		};
		const transaction = await read_function<PaymentsModelAttributes>(
			"Payments",
			"findOne",
			{
				where: {
					phoneNumber,
					status: "PENDING",
				},
			},
		);

		let referenceId: string;

		if (transaction) {
			referenceId = transaction.paymentId;
			(req as TransactionRequest).transaction = transaction;
		} else {
			referenceId = generateUUID();
		}

		const headers = {
			"X-Reference-Id": `${referenceId}`,
			"X-Target-Environment": target,
			"Ocp-Apim-Subscription-Key": subscriptionKey,
			Authorization: `Bearer ${token}`,
		};
		transactionData.XReferenceId = headers["X-Reference-Id"];
		(req as TransactionRequest).transactionData = transactionData;

		const body = {
			amount: `${cart.total}`,
			currency: `${MTN_MOMO_CURRENCY}`,
			externalId: `${cart.userId}`,
			payer: {
				partyIdType: "MSISDN",
				partyId: phoneNumber,
			},
			payerMessage: "Payment initialize",
			payeeNote: "Payment initialize",
		};

		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			res = await axios.post(url, body, { headers });
			(req as MomoInfo).momoInfo = {
				XReferenceId: headers["X-Reference-Id"],
			};
			// res;

			return next();
		} catch (error: any) {
			if (error.response.statusText === "Conflict") {
				(req as MomoInfo).momoInfo = {
					XReferenceId: headers["X-Reference-Id"] as unknown as string,
				};
				return next();
			} else {
				return sendResponse(
					res,
					error.response.status,
					error.response.statusText,
					error.data.message,
				);
			}
		}
	}
	next();
};

export default {
	paymentMethods,
	userHasCart,
	cartHasProducts,
	TAMOUNT_NOTBELOW,
	validMomo,
	requestToPay,
};
