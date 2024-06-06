import app from "../app";
import request from "supertest";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { forgotPassword } from "../controllers/resetPasswort";
import { resetPasswort } from "../controllers/resetPasswort";

import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import {
	bad_two_factor_authentication_data,
	login_user,
	login_user_br,
	login_user_invalid_email,
	login_user_wrong_credentials,
	NewUser,
	partial_two_factor_authentication_data,
	two_factor_authentication_data,
	user_bad_request,
	newPasswordBody,
	NotUserrequestBody,
	sameAsOldPassword,
	new_pass_equals_old_pass,
	new_pass_not_equals_confirm_pass,
	update_with_wrong_old_pass,
	update_pass,
	disable_user,
	new_category,
	order_status,
	enable_user,
	account_status_invalid,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { resetPassword } from "../database/models/resetPassword";
import { read_function } from "../utils/db_methods";
import { allRole, assignRole, createRole } from "../controllers/roleController";

jest.mock("../utils/db_methods", () => ({
	read_function: jest.fn(),
}));

jest.setTimeout(30000);

const role = database_models["role"];
const user = database_models["User"];

jest.setTimeout(30000);
function logErrors(
	err: { stack: any },
	_req: any,
	_res: any,
	next: (arg0: any) => void,
) {
	console.log(err.stack);
	next(err);
}
let token: string;
let buyer_token: string;

const Jest_request = request(app.use(logErrors));

let resetToken = "";
let id: string;
let userId: string;
let adminId: string;
let seller_token: string;
let sellerId: string;
let category_id: string;

describe("SERVER API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
		const adminRole = await role.findOne({ where: { roleName: "ADMIN" } });

		if (adminRole) {
			id = adminRole?.dataValues.id;
		}
		const userStatus = await user.findOne({
			where: { role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
		});
		if (userStatus) {
			userId = userStatus?.dataValues.id;
		}

		buyer_token = generateAccessToken({ id: userId, role: "BUYER" });
		const adminUser = await user.findOne({
			where: { role: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
		});
		if (adminUser) {
			adminId = adminUser?.dataValues.id;
		}
		token = generateAccessToken({ id: adminId, role: "ADMIN" });

		const sellerUser = await user.findOne({
			where: { role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
		});
		if (sellerUser) {
			sellerId = sellerUser?.dataValues.id;
		}
		seller_token = generateAccessToken({ id: sellerId, role: "SELLER" });
	});

	afterAll(async () => {
		await deleteTableData(database_models.Token, "tokens");
		await deleteTableData(database_models.User, "users");
	});

	it("should return 500 when something goes wrong on authenticate the user", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});

		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(two_factor_authentication_data)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
	});

	it("should return 500 when something went wrong on disabling users", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.patch(
			`/api/v1/users/${userId}/account-status`,
		)
			.set("Authorization", `Bearer ${token}`)
			.send(disable_user)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on listing all users", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get("/api/v1/users")
			.set("Authorization", `Bearer ${token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when creating category goes wrong", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_category)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
		expect(body.data).toBeDefined();
	});

	it("should return 500 when fetch all categories goes wrong", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
		expect(body.data).toBeDefined();
	});

	it("should return 500 when something went wrong on getting all orders", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get("/api/v1/orders")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on getting a single order", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get(`/api/v1/orders/{id}`)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went Wrong!");
	});

	it("should return 500 when something went wrong on getting all sales", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get(`/api/v1/sales`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went Wrong!");
	});

	it("should return 500 when something went wrong on getting a single sales", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get(`/api/v1/sales/{id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on updating a status of a sale", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.patch(`/api/v1/sales/{id}/status`)
			.send(order_status)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});
	//server errors=================notifications=================
	it("should return 500 when something went wrong on getting all notifications", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));
		const { body } = await Jest_request.get(`/api/v1/notifications`)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on getting a single notification", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));
		const { body } = await Jest_request.get(
			`/api/v1/notifications/001b7a8c-c767-4aaf-ba61-b71238526bb0`,
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on marking a notification as read", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));
		const { body } = await Jest_request.patch(
			`/api/v1/notifications/001b7a8c-c767-4aaf-ba61-b71238526bb0`,
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on marking all notifications as read", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));
		const { body } = await Jest_request.patch(`/api/v1/notifications`)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on deleting a notification", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));
		const { body } = await Jest_request.delete(
			`/api/v1/notifications/001b7a8c-c767-4aaf-ba61-b71238526bb0`,
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	//server errors=================role =================

	it("it should return server error and return 500 when creates role", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await createRole(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 when something went wrong on getting all wishlist", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));
		const { body } = await Jest_request.get(`/api/v1/wishes`)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});
});
