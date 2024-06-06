import axios from "axios";
import { Response } from "express";
import { create_checkout_session } from "../controllers/paymentController";
import database_models from "../database/config/db.config";
import { orderItems, recordPaymentDetails } from "../services/payment.services";
import { cartModelAttributes } from "../types/model";
import { CartRequest, MomoInfo, TransactionRequest } from "../types/payment";
import { insert_function } from "../utils/db_methods";
import { sendResponse } from "../utils/http.exception";
import {
	MTN_MOMO_REQUEST_PAYMENT_URL,
	MTN_MOMO_SUBSCRIPTION_KEY,
	MTN_MOMO_TARGET_ENVIRONMENT,
} from "../utils/keys";
import { getToken } from "../utils/momoMethods";

jest.mock("axios");
jest.mock("../utils/momoMethods");
jest.mock("../utils/http.exception");
jest.mock("../services/payment.services");
jest.mock("../database/config/db.config", () => ({
	Cart: {
		destroy: jest.fn(),
	},
}));
jest.mock("../utils/db_methods");

describe("MOMO MTN API TEST", () => {
	let req: Partial<CartRequest & MomoInfo & TransactionRequest>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			query: { method: "momo" },
			cart: {
				id: "cart_id",
				total: 90000,
				userId: "user_id",
				products: [
					{ id: "product1", name: "Product 1", price: 50, quantity: 1 },
					{ id: "product2", name: "Product 2", price: 50, quantity: 1 },
				],
			} as cartModelAttributes,
			momoInfo: { XReferenceId: "reference_id" },
			user: { id: "user_id" } as any,
			body: { phoneNumber: "123456789" },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should handle a successful Momo payment transaction without existing transaction", async () => {
		(getToken as jest.Mock).mockResolvedValue("token");
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: "SUCCESSFUL", financialTransactionId: "transaction_id" },
		});
		(recordPaymentDetails as jest.Mock).mockResolvedValue(undefined);
		(orderItems as jest.Mock).mockResolvedValue({ order: "order_details" });
		(database_models.Cart.destroy as jest.Mock).mockResolvedValue(undefined);
		req.transaction = undefined;

		await create_checkout_session(req as any, res as Response);

		expect(getToken).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(
			`${MTN_MOMO_REQUEST_PAYMENT_URL}/reference_id`,
			{
				headers: {
					"X-Target-Environment": MTN_MOMO_TARGET_ENVIRONMENT,
					"Ocp-Apim-Subscription-Key": MTN_MOMO_SUBSCRIPTION_KEY,
					Authorization: "Bearer token",
				},
			},
		);
		expect(recordPaymentDetails).toHaveBeenCalledWith({
			payerId: "user_id",
			paymentId: "reference_id",
			paymentMethod: "momo",
			status: "SUCCESSFUL",
			phoneNumber: "123456789",
		});
		expect(orderItems).toHaveBeenCalledWith(req.cart);
		expect(database_models.Cart.destroy).toHaveBeenCalledWith({
			where: { id: "cart_id" },
		});
		expect(sendResponse).toHaveBeenCalledWith(
			res,
			200,
			"SUCCESSFUL",
			"Products are successfully paid and ordered!",
			{ order: { order: "order_details" } },
		);
	});

	it("should handle a successful Momo payment transaction with existing transaction", async () => {
		(getToken as jest.Mock).mockResolvedValue("token");
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: "SUCCESSFUL", financialTransactionId: "transaction_id" },
		});
		(recordPaymentDetails as jest.Mock).mockResolvedValue(undefined);
		(orderItems as jest.Mock).mockResolvedValue({ order: "order_details" });
		(database_models.Cart.destroy as jest.Mock).mockResolvedValue(undefined);
		req.transaction = { id: "existing_transaction_id" } as any;
		req.transactionData = { token: "existing_token" };

		await create_checkout_session(req as any, res as Response);

		expect(getToken).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(
			`${MTN_MOMO_REQUEST_PAYMENT_URL}/reference_id`,
			{
				headers: {
					"X-Target-Environment": MTN_MOMO_TARGET_ENVIRONMENT,
					"Ocp-Apim-Subscription-Key": MTN_MOMO_SUBSCRIPTION_KEY,
					Authorization: "Bearer token",
				},
			},
		);
		expect(insert_function).toHaveBeenCalledWith(
			"Payments",
			"update",
			{ status: "SUCCESSFUL" },
			{ where: { id: "existing_transaction_id" } },
		);
		expect(orderItems).toHaveBeenCalledWith(req.cart);
		expect(database_models.Cart.destroy).toHaveBeenCalledWith({
			where: { id: "cart_id" },
		});
		expect(sendResponse).toHaveBeenCalledWith(
			res,
			200,
			"SUCCESSFUL",
			"Products are successfully paid and ordered!",
			{ order: { order: "order_details" } },
		);
	});

	it("should handle an unsuccessful Momo payment transaction", async () => {
		(getToken as jest.Mock).mockResolvedValue("token");
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: "FAILED", reason: "Insufficient funds" },
		});

		await create_checkout_session(req as any, res as Response);

		expect(sendResponse).toHaveBeenCalledWith(
			res,
			200,
			"FAILED",
			"Payment FAILED",
			"Insufficient funds",
		);
	});

	it("should handle a pending Momo payment transaction with existing transaction", async () => {
		(getToken as jest.Mock).mockResolvedValue("token");
		(axios.get as jest.Mock).mockResolvedValue({ data: { status: "PENDING" } });
		req.transaction = { id: "existing_transaction_id" } as any;
		req.transactionData = { token: "existing_token" };

		await create_checkout_session(req as any, res as Response);

		expect(sendResponse).toHaveBeenCalledWith(
			res,
			200,
			"PENDING",
			"Payment PENDING",
			{ token: "existing_token" },
		);
	});

	it("should handle errors during the payment process", async () => {
		(getToken as jest.Mock).mockRejectedValue(new Error("Token error"));

		await create_checkout_session(req as any, res as Response);

		expect(sendResponse).toHaveBeenCalledWith(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			"Token error",
		);
	});
});
