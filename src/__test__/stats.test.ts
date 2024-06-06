import request from "supertest";
import app from "../app";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import {
	expired_product,
	new_product,
	new_seller_user,
	two_factor_authentication_data,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { sellerStatistics } from "../controllers/sellerStatisticsController";
import productController from "../controllers/productController";
import { read_function } from "../utils/db_methods";
import { allRole } from "../controllers/roleController";
import wishlistController from "../controllers/wishlistController";

jest.mock("../utils/db_methods");
const mockedReadFunction = read_function as jest.Mock;

function logErrors(
	err: { stack: any },
	_req: any,
	_res: any,
	next: (arg0: any) => void,
) {
	console.log(err.stack);
	next(err);
}

const Jest_request = request(app.use(logErrors));
let seller_token: string;

describe("STATISTICS API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.Order, "orders");
		await deleteTableData(database_models.Payments, "payments");
	});

	it("it should  register a seller and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(new_seller_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});

	it("it should authenticate the user and return 200", async () => {
		const user = await database_models.User.findOne();
		await database_models.User.update(
			{ role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
			{
				where: { id: user?.dataValues.id },
			},
		);
		const authenticatetoken = generateAccessToken({
			id: user?.dataValues.id as string,
			role: "SELLER",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(two_factor_authentication_data)
			.expect(200);

		expect(body.message).toStrictEqual("Account authentication successfully!");
		expect(body.data).toBeDefined();
		seller_token = body.data;
	});

	it("Should list the seller's statistics and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/stats")
			.send()
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.message).toStrictEqual("Here is your statistics");
		expect(body.status).toStrictEqual("SUCCESS");
	});

	it("Should list the seller's statistics and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/stats")
			.send()
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.message).toStrictEqual("Here is your statistics");
		expect(body.status).toStrictEqual("SUCCESS");
	});

	it("should return 500 something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await sellerStatistics(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
