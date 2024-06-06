import app from "../app";
import request from "supertest";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import {
	new_category,
	new_product,
	new_seller_user,
	new_update_product,
	two_factor_authentication_data,
	search_product,
	search_product_Not_found,
	review_user,
	login_user,
	review_user_login,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { read_function } from "../utils/db_methods";
import { response } from "express";
import searchProduct from "../controllers/searchProduct";

jest.setTimeout(100000);

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
let product_id: any;
describe("PRODUCT API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(database_models.Category, "categories");
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
		expect(body.data).toBeDefined();
		category_id = body.data?.id;
	});

	it("Seller should create a product", async () => {
		const all_images = new_product.images;

		let request = Jest_request.post("/api/v1/products")
			.set("Authorization", `Bearer ${seller_token}`)
			.field("name", new_product.name)
			.field("price", new_product.price)
			.field("discount", new_product.discount)
			.field("quantity", new_product.quantity)
			.field("categoryId", category_id)
			.field("expiryDate", new_product.expiryDate);

		for (const image of all_images) {
			request = request.attach("images", image);
		}

		await request.expect(201);
		expect((await request).body.status).toStrictEqual("SUCCESS");
		expect((await request).body.message).toStrictEqual(
			"Product added successfully!",
		);
		expect((await request).body.data).toBeDefined();

		product_id = (await request).body.data?.id;
	});

	it("should return 409 when the seller already have the product", async () => {
		const all_images = new_product.images;

		let request = Jest_request.post("/api/v1/products")
			.set("Authorization", `Bearer ${seller_token}`)
			.field("name", new_product.name)
			.field("price", new_product.price)
			.field("discount", new_product.discount)
			.field("quantity", new_product.quantity)
			.field("categoryId", category_id)
			.field("expiryDate", new_product.expiryDate);

		for (const image of all_images) {
			request = request.attach("images", image);
		}

		await request.expect(409);
		expect((await request).body.status).toStrictEqual("CONFLICT");
		expect((await request).body.message).toStrictEqual(
			"Product already exist, You can update it instead!",
		);
	});

	it("should return 400 if the category doesn't exist", async () => {
		const all_images = new_product.images;
		let request = Jest_request.post("/api/v1/products")
			.set("Authorization", `Bearer ${seller_token}`)
			.field("name", new_update_product.name)
			.field("price", new_product.price)
			.field("discount", new_product.discount)
			.field("quantity", new_product.quantity)
			.field("categoryId", "0c2b96e7-59da-40e2-92fe-943dc7130762")
			.field("expiryDate", new_product.expiryDate);

		for (const image of all_images) {
			request = request.attach("images", image);
		}

		await request.expect(400);
		expect((await request).body.status).toStrictEqual("BAD REQUEST");
		expect((await request).body.message).toStrictEqual(
			"Category doesn't exist, create one and try again!",
		);
	});

	it("should fetch all products and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/products")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Products fetched successfully!");
		expect(body.data).toBeDefined();
	});

	it("should fetch single product and return 404 if not found", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/products/96ff9146-ad09-4dbc-b100-94d3b0c33562`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Product not found or not owned!");
	});

	it("should fetch single and return 200", async () => {
		const { body } = await Jest_request.get(`/api/v1/products/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Product fetched successfully!");
		expect(body.data).toBeDefined();
	});

	it("should return 404 when product doesn't exist", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/products/97dcfe1e-0686-4876-808a-f3d3ec36c7ff`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Product not found or not owned!");
	});

	it("should return 400 when product is invalid", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/products/97dcfe1e-0686-4876-808a-f3d3ec36c`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("You provided Invalid ID!");
	});

	it("should return 404 if product doesn't exist", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/products/96ff9146-ad09-4dbc-b100-94d3b0c33562`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.field("price", new_update_product.price)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual(
			"The product you're trying to update is not found or owned!",
		);
	});

	it("should return 400 if product id is invalid", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/products/96ff9146-ad09-4dbc-b100-94d3b0c33`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.field("price", new_update_product.price)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("You provided Invalid ID!");
	});

	it("should update product and return 200", async () => {
		const { body } = await Jest_request.patch(`/api/v1/products/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.field("categoryId", "e4d3f656-7ae6-42a4-bcb4-ec2b993ea80a")
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"Category doesn't exist, create one and try again!",
		);
	});

	it("should return 400 when seller upddate low number of images", async () => {
		const all_images = new_update_product.images;

		let request = Jest_request.patch(`/api/v1/products/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.field("discount", new_update_product.discount);

		for (const image of all_images) {
			request = request.attach("images", image);
		}

		await request.expect(400);
		expect((await request).body.status).toStrictEqual("BAD REQUEST");
		expect((await request).body.message).toBeDefined();
	});

	it("should update product and return 200", async () => {
		const { body } = await Jest_request.patch(`/api/v1/products/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.field("discount", new_update_product.discount)
			.field("quantity", new_update_product.quantity)
			.field("price", new_update_product.price)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Product updated successfully!");
		expect(body.data).toBeDefined();
	});
	it("It should update product availability status and return 200", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/products/${product_id}/availability-status`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Product status updated successfully!");
		expect(body.data).toBeDefined();
	});

	it("it should return searched product with name only", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({
				name: search_product.name,
			})
			.expect(200);
		expect(body.status).toStrictEqual("success");
		expect(body.product).toBeDefined();
	});

	it("it should return searched product with category only", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({ categoryName: search_product.categoryName })
			.expect(200);
		expect(body.status).toStrictEqual("success");
		expect(body.product).toBeDefined();
	});

	it("it should return searched product with in Price range", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({ maxPrice: search_product.maxPrice })
			.query({ minPrice: search_product.minPrice })
			.expect(200);
		expect(body.status).toStrictEqual("success");
		expect(body.product).toBeDefined();
	});

	it("it should return searched product with minumum price only", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({ minPrice: search_product.minPrice })
			.expect(200);
		expect(body.status).toStrictEqual("success");
		expect(body.product).toBeDefined();
	});

	it("it should return searched product with maxPrice only", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({ maxPrice: search_product.maxPrice })
			.expect(200);
		expect(body.status).toStrictEqual("success");
		expect(body.product).toBeDefined();
	});

	it("it should return bad request when we are using mismatch type in price", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({ maxPrice: search_product.name })
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("maxPrice must be a number");
	});

	it("it should return product not found", async () => {
		const { body } = await Jest_request.get("/api/v1/products/search?")
			.query({ name: search_product_Not_found.name })
			.expect(200);
		expect(body.message).toStrictEqual("no product found");
	});

	it("should not update product availability status of unavailable product and return 404", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/products/4dde8798-5e62-4a84-b44f-c04b71859b25/availability-status`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual(
			"The product you're trying to update status for is not found or owned!",
		);
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(review_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});

	it("should delete a product and return 200", async () => {
		const { body } = await Jest_request.delete(`/api/v1/products/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Product deleted successfully!");
	});

	it("should return 404 when the product doesn't exist", async () => {
		const { body } = await Jest_request.delete(`/api/v1/products/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual(
			"The product you're trying to delete is not found or owned!",
		);
	});

	it("should return 400 when the seller provided an invalid id", async () => {
		const { body } = await Jest_request.delete(
			`/api/v1/products/96ff9146-ad09-4dbc-b100-94d3b0c33`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("You provided Invalid ID!");
	});

	it("should drop server error when a user try to create a product", async () => {
		jest.spyOn(response, "status").mockImplementationOnce(() => {
			throw new Error("Invalid status on response!");
		});
		const { body } = await Jest_request.post("/api/v1/products")
			.set("Authorization", `Bearer ${seller_token}`)
			.field("name", new_product.name)
			.field("price", new_product.price)
			.field("discount", new_product.discount)
			.field("quantity", new_product.quantity)
			.field("categoryId", category_id)
			.field("expiryDate", new_product.expiryDate)
			.expect(500);
	});

	it("should return 500 while fetch all products", async () => {
		jest.spyOn(response, "status").mockImplementationOnce(() => {
			throw new Error("Internal server error!");
		});
		const { body } = await Jest_request.get("/api/v1/products")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
	});
	it("it should return server error and return 500 when searching product", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await searchProduct.search_product(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
	});
});
