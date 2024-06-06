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
	two_factor_authentication_data,
	NewUser,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { Token } from "../database/models/token";
import { jest } from "@jest/globals";
import { stripe } from "../controllers/paymentController";
import cartService from "../services/carts.services";
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

let token: string;

describe("STRIPE PAYMENTS API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Cart, "carts");
		await deleteTableData(database_models.Order, "orders");
		await deleteTableData(database_models.Payments, "payments");
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
	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);

		const tokenRecord = await Token.findOne();
		token = tokenRecord?.dataValues.token ?? "";
	});

	it("should successfully login a user and return 200", async () => {
		const loginUser = {
			email: NewUser.email,
			password: NewUser.password,
		};

		await database_models.User.update(
			{ isVerified: true },
			{ where: { email: loginUser.email } },
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(loginUser)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Login successfully!");
		expect(body.data).toBeDefined();
		token = body.data;
	});

	it("should return 404 when a user have no cart", async () => {
		const { body } = await Jest_request.post("/api/v1/payments?method=stripe")
			.set("Authorization", `Bearer ${token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual(
			"No cart found! Try adding some products in the cart.",
		);
	});

	it("should return 201 and added to cart successfully", async () => {
		await database_models.Product.update(
			{ isAvailable: true },
			{ where: { id: product_id } },
		);
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 10 });
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("added to cart successfully");
	});
	it("should return 201 and added to cart successfully again", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 10 });
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Added to cart successfully");
	});

	it("should return 402 when the payment method is invalid", async () => {
		const { body } = await Jest_request.post("/api/v1/payments?method=paypal")
			.set("Authorization", `Bearer ${token}`)
			.expect(402);

		expect(body.status).toStrictEqual("PAYMENT REQUIRED");
		expect(body.message).toStrictEqual(
			"Invalid payment method! I recommend you to use stripe or momo here!",
		);
	});

	it("should return 200 and Cart Successfully Clear", async () => {
		const { body } = await Jest_request.put(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Cart Successfully Clear");
	});

	it("should return 400 when a the cart is empty", async () => {
		const { body } = await Jest_request.post("/api/v1/payments?method=stripe")
			.set("Authorization", `Bearer ${token}`)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"You can't pay an empty cart! Please add some products!",
		);
	});

	it("should return 201 and added to cart successfully", async () => {
		await database_models.Product.update(
			{ isAvailable: true, price: 5 },
			{ where: { id: product_id } },
		);
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 10 });
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Added to cart successfully");
	});

	it("should should successfully create a checkout session url", async () => {
		const { body } = await Jest_request.post("/api/v1/payments?method=stripe")
			.set("Authorization", `Bearer ${token}`)
			.expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toBeDefined();
	});

	it("should return 201 and added to cart successfully", async () => {
		await database_models.Product.update(
			{ isAvailable: true, price: 499000 },
			{ where: { id: product_id } },
		);
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 10 });
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Added to cart successfully");
	});
	it("should return 201 and added to cart successfully again", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 10 });
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Added to cart successfully");
	});

	it("should should successfully create a checkout session url", async () => {
		const { body } = await Jest_request.post("/api/v1/payments?method=stripe")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Checkout session created successfully!",
		);
		expect(body.data.sessionUrl).toBeDefined();
	});

	it("should return 200 when the order is successfully ordered", async () => {
		const user = await database_models.User.findOne({
			where: { email: NewUser.email },
		});
		const query = {
			sessionId:
				"cs_test_b1nkEgjxDOwll8JGLEnh7E4VYQK1SJOwX4347rR043VKOFwVT37HhA8FCX",
			payerId: user?.id,
		};
		const { body } = await Jest_request.get(
			`/api/v1/payments/success?sessionId=${query.sessionId}&payerId=${query.payerId}`,
		).expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Products are successfully paid and ordered!",
		);
		expect(body.data.order).toBeDefined();
	});

	it("should return 500 when payment goes wrong!", async () => {
		const { body } = await Jest_request.post("/api/v1/payments/cancel").expect(
			500,
		);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Payment process error!");
	});

	it("should return 201 and added to cart successfully", async () => {
		await database_models.Product.update(
			{ isAvailable: true, price: 499000 },
			{ where: { id: product_id } },
		);
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 10 });
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Added to cart successfully");
	});

	it("should drop server error on checkout session creation", async () => {
		jest
			.spyOn(stripe.checkout.sessions, "create")
			.mockImplementationOnce(() => {
				throw new Error("Internal server error!");
			});

		const { body } = await Jest_request.post("/api/v1/payments?method=stripe")
			.set("Authorization", `Bearer ${token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
		expect(body.data).toStrictEqual("Internal server error!");
	});

	it("should drop server error on success payment", async () => {
		jest
			.spyOn(cartService, "findCartByUserIdService")
			.mockImplementationOnce(() => {
				throw new Error("Something wrong went wrong while finding user cart!");
			});

		const { body } = await Jest_request.get("/api/v1/payments/success").expect(
			500,
		);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBeDefined();
	});
});
