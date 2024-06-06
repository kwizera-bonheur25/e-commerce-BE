import { Request, Response } from "express";
import { googleAuthInit } from "../controllers/userController";
import passport from "../middlewares/passport";

jest.mock("../middlewares/passport", () => ({
	authenticate: jest.fn(),
}));

describe("googleAuthInit", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let mockRedirect: jest.Mock;

	beforeEach(() => {
		req = {};
		mockRedirect = jest.fn();
		res = {
			redirect: mockRedirect,
		};
	});

	it("should call google callback endpoint and redirect to callback URL", async () => {
		await googleAuthInit(req as Request, res as Response);

		expect(passport.authenticate).toHaveBeenCalledWith("google", {
			scope: ["profile", "email"],
		});
		expect(mockRedirect).toHaveBeenCalledWith(
			"/api/v1/users/auth/google/callback",
		);
	});
});
