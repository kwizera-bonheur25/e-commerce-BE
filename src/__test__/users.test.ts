import app from "../app";
import request from "supertest";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { forgotPassword } from "../controllers/resetPasswort";
import { resetPasswort } from "../controllers/resetPasswort";
import { Request, Response } from "express";

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
	NewUserPasswordExpired,
	updated_profile_data,
	updated_profile_error,
	update_pass_empty,
	disable_user,
	enable_user,
	account_status_invalid,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { resetPassword } from "../database/models/resetPassword";
import userController from "../controllers/userController";
import productController from "../controllers/productController";
import { chatLogin, read_all_messages } from "../controllers/chat";
import { assignRole, updateRole } from "../controllers/roleController";
import userMiddleware from "../middlewares/user.middleware";
import {
	roleIdValidations,
	roleNameValid,
} from "../middlewares/role.middleware";

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
let admin_token: string;

const Jest_request = request(app.use(logErrors));

let resetToken = "";
let id: string;
let userId: string;
let adminId: string;

describe("USER API TEST", () => {
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
		const adminUser = await user.findOne({
			where: { role: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
		});
		if (adminUser) {
			adminId = adminUser?.dataValues.id;
		}

		admin_token = generateAccessToken({ id: adminId, role: "ADMIN" });
	});

	afterAll(async () => {
		await deleteTableData(database_models.Token, "tokens");
		await deleteTableData(database_models.User, "users");
	});
	it("Welcome to Hacker's e-commerce backend and return 200", async () => {
		const { body } = await Jest_request.get("/").expect(200);
	});

	it("should display login home page and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/").expect(200);
		expect(body.message).toBe("Welcome to Hacker's e-commerce backend!");
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
		const tokenRecord = await database_models.Token.findOne();
		token = tokenRecord?.dataValues.token ?? "";
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUserPasswordExpired)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});

	it("it should return a user not found and status 400", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(user_bad_request)
			.expect(400);
	});

	it("it should return a user exist and status 409 when Email is already used in database", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(409);
	});

	it("should verify a user's account and return 200", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Email verified successfully!");
	});

	it("should return 400 when the token is invalid", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		).expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("Invalid link");
	});

	it("should successfully login a user and return 200", async () => {
		await database_models.User.update(
			{ isVerified: true },
			{
				where: { email: login_user.email },
			},
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Login successfully!");
	});

	/**
	 * -----------------------------------------PROFILE--------------------------------------
	 */

	it("Should list profile details and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/profile")
			.send()
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			`Hi ${NewUser.firstName} Here is your profile`,
		);
	});

	it("Should update profile and return 200", async () => {
		const { body } = await Jest_request.patch("/api/v1/profile")
			.set("Authorization", `Bearer ${token}`)
			.field("firstName", updated_profile_data.firstName)
			.field("lastName", updated_profile_data.lastName)
			.field("phoneNumber", updated_profile_data.phoneNumber)
			.field("city", updated_profile_data.city)
			.field("gender", updated_profile_data.gender)
			.field("country", updated_profile_data.country)
			.field("preferredLanguage", updated_profile_data.preferredLanguage)
			.field("preferredCurrency", updated_profile_data.preferredCurrency)
			.field("addressLine1", updated_profile_data.addressLine1)
			.field("birthDate", updated_profile_data.birthDate)
			.attach("profileImage", updated_profile_data.profileImage);
		expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Profile updated successfully");
	});

	it("Should return 400 and error message", async () => {
		const { body } = await Jest_request.patch("/api/v1/profile")
			.set("Authorization", `Bearer ${token}`)
			.field("phoneNumber", updated_profile_error.phoneNumber)
			.field("city", updated_profile_error.city)
			.field("gender", updated_profile_error.gender)
			.field("country", updated_profile_error.country)
			.field("preferredLanguage", updated_profile_error.preferredLanguage)
			.field("preferredCurrency", updated_profile_error.preferredCurrency)
			.field("addressLine1", updated_profile_error.addressLine1)
			.field("birthDate", updated_profile_error.birthDate);
		expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"phone number must be a valid and has country code",
		);
	});

	it("Should successfully login a seller and return 202", async () => {
		await User.update(
			{ role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
			{
				where: { email: login_user.email },
			},
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user)
			.expect(202);

		expect(body.status).toStrictEqual("ACCEPTED");
		expect(body.message).toStrictEqual(
			"Email sent for verification. Please check your inbox and enter the OTP to complete the authentication process.",
		);
	});

	it("should return 403 if user account is disabled (user.isActive === false)", async () => {
		await database_models.User.update(
			{ isActive: false },
			{ where: { email: login_user.email } },
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user)
			.expect(403);

		expect(body.status).toStrictEqual("FORBIDDEN");
		expect(body.message).toStrictEqual("Your account has been disabled");
	});

	it("should return 400 when a user user enter invalid email (login validation purposes)", async () => {
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user_invalid_email)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("Invalid email!");
	});

	it("should return 400 when request body is invalid", async () => {
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send({})
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toBeDefined();
	});

	it("should return 400 when password is not provided", async () => {
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user_br)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("password is required");
	});

	/***
	 * ----------------------------- Updating password -------------------------------------------
	 */

	it("should return 401 when token is not provided", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.send(update_pass)
			.expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
		expect(body.message).toStrictEqual("Please login to continue");
	});

	it("should validate the request send when updating password", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send({})
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toBeDefined();
	});

	it("should return 400 when old pass, is not equal to one in database", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send(update_with_wrong_old_pass)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("Old password is incorrect");
	});

	it("should return 400 when new password and confirm password do not match", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send(new_pass_not_equals_confirm_pass)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"New password and confirm password do not match",
		);
	});

	it("should return 400 when new password is equal to old password", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send(new_pass_equals_old_pass)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"New password cannot be the same as old password",
		);
	});

	it(" should update user password and return 200 ", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send(update_pass)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Password updated successfully");
	});

	it("should return 400 and error message", async () => {
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send(update_pass_empty)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");

		expect(body.message).toStrictEqual("Password field can't be empty");
	});

	it("should return 500 when something went wrong", async () => {});

	/***
	 * ----------------------------- Getting all users, Disabling/Enabling user's Account -------------------------------------------
	 */
	it("should return 404 when not admin tries to get all users", async () => {
		const { body } = await Jest_request.get("/api/v1/users")
			.set("Authorization", `Bearer ${token}`)
			.expect(403);
		expect(body.message).toBe("you are not allowed to access this route!");
	});

	it("should get all users and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/users")
			.set("Authorization", `Bearer ${admin_token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toBe("Here is a list of users");
	});

	it("it should return 404 when user is not found", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/users/b605555a-c6ec-405e-b4fe-89ee24c34a89/account-status`,
		)
			.set("Authorization", `Bearer ${admin_token}`)
			.send(disable_user)
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toBe("User not found");
	});

	it("it should disable user's account and return 200", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/users/${userId}/account-status`,
		)
			.set("Authorization", `Bearer ${admin_token}`)
			.send(disable_user)
			.expect(200);
		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Account disabled successfully");
	});

	it("it should enable user's account and return 200", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/users/${userId}/account-status`,
		)
			.set("Authorization", `Bearer ${admin_token}`)
			.send(enable_user)
			.expect(200);
		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Account enabled successfully");
	});

	it("it should return joi error", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/users/${userId}/account-status`,
		)
			.set("Authorization", `Bearer ${admin_token}`)
			.send(account_status_invalid)
			.expect(400);
		expect(body.status).toBe("BAD REQUEST");
		expect(body.message).toBe("field can't be empty");
	});

	/***
	 * ---------------------------- RESET PASSWORD --------------------------------------------
	 */

	it("it should return 200 when email is sent to user resetting password", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			email: NewUser.email,
		});
		await resetPassword.create({
			resetToken: authenticatetoken,
			email: NewUser.email,
		});
		const { body } = await Jest_request.post("/api/v1/users/forgot-password")
			.send({ email: NewUser.email })
			.expect(200);
		resetToken = authenticatetoken;
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Email sent successfully");
	});

	it("it should return 404 when user requesting reset is not found in database", async () => {
		const { body } = await Jest_request.post("/api/v1/users/forgot-password")
			.send(NotUserrequestBody)
			.expect(404);

		expect(body.message).toEqual("User not found");
	});

	it("it should return 400 when email is not provided", async () => {
		const { body } = await Jest_request.post("/api/v1/users/forgot-password")
			.send({})
			.expect(400);
	});

	it("it should return 200 when password reset successfully", async () => {
		expect(resetToken).toBeDefined();
		expect(resetToken).not.toEqual("");
		const tokenRecord = await resetPassword.findOne();
		const tokenn = tokenRecord?.dataValues.resetToken;

		const { body } = await Jest_request.post(
			`/api/v1/users/reset-password/${tokenn}`,
		)
			.send(newPasswordBody)
			.expect(200);
	});

	it("it should return 400 when new password is the same to old password", async () => {
		const { body } = await Jest_request.post(
			`/api/v1/users/reset-password/${resetToken}`,
		)
			.send(sameAsOldPassword)
			.expect(400);
		expect(resetToken).toBeDefined();
		expect(resetToken).not.toEqual("");
	});

	it("it should return 400 when invalid link is provided", async () => {
		const { body } = await Jest_request.post(
			`/api/v1/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYmM3NzM4LWE5YWItNDc2MC1hYzIxLWUzNTZkNGY0NDZjNyIsImVtYWlsIjoiaXphbnlpYnVrYXl2ZXR0ZTEwNUBnbWFpbC5jb20iLCJpYXQiOjE3MTQwNzcxOTksImV4cCI6MTcxNDE2MzU5OX0.wwtJXaviKcQYqmVX0LI0Yw1jG0wmBSqW4rHZA0Vh8zk`,
		)
			.send(newPasswordBody)
			.expect(400);
	});

	it("should return 400 when no token is provided", async () => {
		const { body } = await Jest_request.post("/api/v1/users/reset-password/")
			.send(newPasswordBody)
			.expect(404);
	});

	jest.mock("../helpers/nodemailer", () => ({
		sendEmail: jest.fn(),
	}));

	it("should send an email with the correct mailOptions", async () => {
		const req: any = {
			body: { email: "test@example.com" },
		} as any;

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		await forgotPassword(req, res);
	});

	it("should return 500 something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await resetPasswort(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	/*
	 * ---------------------------- TWO FACTOR AUTHENTICATION --------------------------------------------
	 */

	it("should authenticate the user and return SUCCESS", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(two_factor_authentication_data)
			.expect(200);

		expect(body.message).toStrictEqual("Account authentication successfully!");
	});

	it("should return 401 if user add invalid otp", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(bad_two_factor_authentication_data)
			.expect(401);
		expect(body.message).toStrictEqual("Invalid One Time Password!!");
	});

	it("should return 400 if user add with character < 6 invalid otp", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(partial_two_factor_authentication_data)
			.expect(400);
		expect(body.message).toStrictEqual(
			"OTP must be exactly 6 characters long!",
		);
	});

	it("should return 400 if otp is not provided", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send({})
			.expect(400);
		expect(body.message).toStrictEqual("otp is required");
	});

	it("should handle server error", async () => {
		const req = {
			body: { otp: "123456" },
			params: { token: "valid_token" },
		} as unknown as Request;
		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
			json: jest.fn(),
		} as unknown as Response;

		await userController.two_factor_authentication(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	/**
	 * -----------------------------------------LOG OUT--------------------------------------
	 */

	it("Should log out a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout")
			.send()
			.set("Authorization", `Bearer ${token}`);
		expect(201);
		expect(body.status).toStrictEqual("CREATED");
		expect(body.message).toStrictEqual("Logged out successfully");
	});

	it("Should alert an error and return 401", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout").send();
		expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
	});

	it("should return 500 something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await forgotPassword(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await userController.accountVerify(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await userController.logout(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await userController.read_profile(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await userController.updatePassword(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await userController.update_user_profile(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await productController.delete_product(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await productController.create_product(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await productController.read_single_product(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await productController.update_product(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 and something wend wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await productController.update_product_status(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	test("userValid middleware should return 500 for internal server error", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const next = jest.fn(() => {
			throw new Error("Internal Server Error");
		});
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		await userMiddleware.userValid(req, res, next);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	test("userValid middleware should return 500 for internal server error", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const next = jest.fn(() => {
			throw new Error("Internal Server Error");
		});
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		await roleNameValid(req, res, next);

		expect(res.status).toHaveBeenCalledWith(500);
	});
	test("userValid middleware should return 500 for internal server error", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const next = jest.fn(() => {
			throw new Error("Internal Server Error");
		});
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		await roleIdValidations(req, res, next);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
