import app from "../app";
import request from "supertest";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import {
	new_buyer_user,
	new_category,
	new_seller_user,
	new_updated_category,
	two_factor_authentication_data,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import * as dbMethods from "../utils/db_methods";

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

const Jest_request = request(app.use(logErrors));
let seller_token: string;
let category_id: string;
let second_seller_token: string;

describe("CATEGORY ENDPOINTS", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.User, "users");
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(new_buyer_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
		const tokenRecord = await database_models.Token.findOne();
		second_seller_token = tokenRecord?.dataValues.token ?? "";
	});

	it("should return 403 when a buyer try to add a category", async () => {
		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${second_seller_token}`)
			.send(new_category)
			.expect(403);

		expect(body.status).toStrictEqual("FORBIDDEN");
		expect(body.message).toStrictEqual(" Only seller can perform this action!");
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(new_seller_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});

	it("should authenticate the user and return SUCCESS", async () => {
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

	it("should create a new category and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_category)
			.expect(201);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Category added successfully!");
		expect(body.data).toBeDefined();

		category_id = body.data.id;
	});

	it("should create a new category and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_category)
			.expect(409);

		expect(body.status).toStrictEqual("CONFLICT");
		expect(body.message).toStrictEqual(
			`Category named ${new_category.name} already exist!`,
		);
	});

	it("should return server error on creation of category", async () => {
		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.send()
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual(`Something went wrong!`);
	});

	it("should return 409 when category already exist", async () => {
		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_category)
			.expect(409);

		expect(body.status).toStrictEqual("CONFLICT");
		expect(body.message).toStrictEqual(
			`Category named ${new_category.name} already exist!`,
		);
	});

	it("should fetch all catgories and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Categories fetched successfully!");
		expect(body.data).toBeDefined();
	});

	it("should return when a user provide an invalid id", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/categories/96ff9146-ad09-4dbc-b100-94d3b0c33`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("You provided Invalid ID!");
	});

	it("should fetch single category and return 200", async () => {
		const { body } = await Jest_request.get(`/api/v1/categories/${category_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Category fetched successfully!");
		expect(body.data).toBeDefined();
	});

	it("should return 200 when the category is not found", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/categories/f826ac00-915b-44f1-ba4e-952e50952df4`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Category not found!");
	});

	it("should update a category and return 400", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/categories/${category_id}`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.send({})
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("No field provided to update!");
	});

	it("should return 400 when you try to update unexisting category", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/categories/f826ac00-915b-44f1-ba4e-952e50952df4`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_updated_category)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Category not found!");
	});

	it("should update a category and return 200", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/categories/${category_id}`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_updated_category)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Category updated successfully!");
		expect(body.data).toBeDefined();
	});

	it("should return 400 when a user provided an invalid id", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/categories/96ff9146-ad09-4dbc-b100-94d3b0c33`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_updated_category)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("You provided Invalid ID!");
	});
	it("should handle server error", async () => {
		jest.spyOn(dbMethods, "read_function").mockImplementationOnce(() => {
			throw new Error("Server error");
		});

		const { body } = await Jest_request.post(`/api/v1/categories/`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send({ name: "new category", description: "new category description" })
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
	});
	it("should handle server error", async () => {
		jest.spyOn(dbMethods, "read_function").mockImplementationOnce(() => {
			throw new Error("Server error");
		});

		const { body } = await Jest_request.get(`/api/v1/categories/`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
	});
	it("should handle server error", async () => {
		jest.spyOn(dbMethods, "read_function").mockImplementationOnce(() => {
			throw new Error("Server error");
		});

		const { body } = await Jest_request.get(`/api/v1/categories/1`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("You provided Invalid ID!");
	});
});
