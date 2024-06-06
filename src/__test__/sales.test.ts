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
	order_status,
	status_not_neither_canceler_delivered_nor_pending,
	status_empty,
	status_invalid_date,
	status_past_date,
	mock_users,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { Token } from "../database/models/token";
import { jest } from "@jest/globals";
import { lineCartItems } from "../services/payment.services";
import { stripe } from "../controllers/paymentController";
import cartService from "../services/carts.services";
import { isAvailable } from "../utils/nodeEvents";
jest.setTimeout(100000);

// jest.mock("../services/payment.services", () => ({
// 	lineCartItems: jest.fn()
// }))

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
let order_id: any;
let sale_id: any;
let sales: any;

let token: string;

describe("SALE API TEST", () => {
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
			{ isAvailable },
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
			{ isAvailable, price: 5 },
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
			{ isAvailable, price: 499000 },
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

	it("should return 200 when orders are retrieved successfully", async () => {
		const { body } = await Jest_request.get("/api/v1/orders")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Orders retrieved successfully");

		order_id = body.data[0].id;
	});

	it("should return 200 when single order is retrieved successfully", async () => {
		const { body } = await Jest_request.get(`/api/v1/orders/${order_id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Order retrieved Successfully!");
	});

	it("should return 200 when sales are retrieves successfully", async () => {
		const { body } = await Jest_request.get("/api/v1/sales")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Sales retrieved successfully");

		sales = body.data;

		sale_id = body.data[0].id;
	});

	it("should return 200 when single sale is retrieved successfully", async () => {
		const { body } = await Jest_request.get(`/api/v1/sales/${sale_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Sale retrieved successfully");
	});

	it("should return 200 when sale status is updated successfuly", async () => {
		const { body } = await Jest_request.patch(`/api/v1/sales/${sale_id}/status`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(order_status)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Sale status updated successfully");
	});

	it("should return 404 when the sale is not found", async () => {
		jest.spyOn(database_models.Sales, "findOne").mockResolvedValue(null);

		const { body } = await Jest_request.patch(`/api/v1/sales/${sale_id}/status`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(order_status)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Sale not found");
	});

	it("should return error when status value is neither cancelled, delivered nor pending", async () => {
		const { body } = await Jest_request.patch(`/api/v1/sales/${sale_id}/status`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(status_not_neither_canceler_delivered_nor_pending)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"status field must be either 'Pending', 'canceled' or 'delivered'!",
		);
	});

	it("should return error when passing empty status value", async () => {
		const { body } = await Jest_request.patch(`/api/v1/sales/${sale_id}/status`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(status_empty)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"status field must be either 'Pending', 'canceled' or 'delivered'!",
		);
	});

	it("should return error when passing invalid status date", async () => {
		const { body } = await Jest_request.patch(`/api/v1/sales/${sale_id}/status`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(status_invalid_date)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual(
			"deliveryDate must be in ISO 8601 date format",
		);
	});

	it("should return error for past date on status's delivery date", async () => {
		const { body } = await Jest_request.patch(`/api/v1/sales/${sale_id}/status`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send(status_past_date)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("deliveryDate must be in the future");
	});
});
