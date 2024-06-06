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
	invalidTokens,
} from "../mock/static";
import { isAvailable } from "../utils/nodeEvents";
import { generateAccessToken } from "../helpers/security.helpers";
import { Token } from "../database/models/token";
import cartService from "../services/carts.services";
import UserUtils from "../utils/users";
import { jest } from "@jest/globals";
import CartUtils from "../utils/cart.utils";
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

describe("CART API TEST", () => {
	let cart: any;
	let item: any;
	beforeAll(async () => {
		await connectionToDatabase();
		cart = { products: [], total: 0 };
		item = { id: 1, totalPrice: 100 };
	});

	afterAll(async () => {
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Cart, "carts");
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
	it("should return 401 and please login to continue", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.send({ productId: "96ff9146-ad09-4dbc-b100-94d3b0c33562", quantity: 40 })
			.expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
		expect(body.message).toStrictEqual("Please login to continue");
	});
	it("should return 401 and invalid token", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${invalidTokens.invalidtoke}`)
			.send({ productId: "96ff9146-ad09-4dbc-b100-94d3b0c33562", quantity: 40 })
			.expect(401);
		expect(body.message).toStrictEqual("Invalid token!");
	});
	it("should return 403 and User should be buyer", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${seller_token}`)
			.send({ productId: "96ff9146-ad09-4dbc-b100-94d3b0c33562", quantity: 40 })
			.expect(403);
		expect(body.message).toStrictEqual("Only buyer can perform this action!");
	});
	it("should return 404 when user try to add not exist product", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: "96ff9146-ad09-4dbc-b100-94d3b0c33562", quantity: 40 })
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("product is not found");
	});
	it("should return 403 and product is expired", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 4 })
			.expect(403);
		expect(body.status).toStrictEqual("FORBIDDEN");
		expect(body.message).toStrictEqual("product is not available");
	});
	it("should return 400 and invalid product id", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: "96ff9146-ad09-4dbc-b100-94d3b0c3", quantity: 40 })
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("Invalid product id");
	});

	it("should return 200 and return empty cart", async () => {
		const { body } = await Jest_request.get(`/api/v1/carts/`).set(
			"Authorization",
			`Bearer ${token}`,
		);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Cart is empty");
	});
	it("should return 400 and quantity is required", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id })
			.expect(400);
		expect(body.status).toStrictEqual("Error");
	});
	it("should return 400 and discount is not allowed", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 2, discount: 20 })
			.expect(400);
		expect(body.status).toStrictEqual("Error");
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
	it("should return 404 and Not enough quantity in stock", async () => {
		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 40000 })
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Not enough quantity in stock");
	});
	it("should return 200 and cart with product", async () => {
		const { body } = await Jest_request.get(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Cart Successfully fetched");
	});
	it("should return 404 and product not found in cart", async () => {
		const { body } = await Jest_request.patch(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: "96ff9146-ad09-4dbc-b100-94d3b0c33562", quantity: 1 })
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("product is not found");
	});
	it("should return 201 and Cart successfully updated", async () => {
		const { body } = await Jest_request.patch(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 3 })
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Cart successfully updated");
	});
	it("should return 200 and Cart Successfully Clear", async () => {
		const { body } = await Jest_request.put(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Cart Successfully Clear");
	});
	it("should return 404 and product does not exist on update", async () => {
		const { body } = await Jest_request.patch(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 3 })
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Product does not exist");
	});
	it("updates cart products and total", async () => {
		const cart = { id: "testCartId", products: [], total: 0 };
		const newTotal = 100;
		jest.spyOn(database_models.Cart, "update").mockResolvedValue([1]);

		const result = await cartService.updateCartProductsAndTotalService(
			cart,
			newTotal,
		);

		expect(database_models.Cart.update).toHaveBeenCalledWith(
			{ products: cart.products, total: newTotal },
			{ where: { id: cart.id } },
		);
		expect(result).toEqual([1]);
	});
	it("creates a new cart", async () => {
		const userId = "testUserId";
		const item = { id: "testItemId" };
		const mockCart = { id: "testCartId", products: [item], total: 0 };
		jest.spyOn(database_models.Cart, "create").mockResolvedValue(mockCart);

		const result = await cartService.createCartService(userId, item);

		expect(database_models.Cart.create).toHaveBeenCalledWith({
			products: [item],
			userId: userId,
			total: 0,
		});
		expect(result).toEqual(mockCart);
	});
	test("should update the cart correctly", () => {
		const result = CartUtils.updateCart(cart, item);

		expect(result.cart.products).toContain(item);
		expect(result.newTotal).toBe(item.totalPrice);
	});

	it("should handle internal server error in getRequestUserId", async () => {
		jest.spyOn(UserUtils, "getRequestUserId").mockImplementationOnce(() => {
			throw new Error("Internal server error");
		});

		const { body } = await Jest_request.get(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.expect(500);

		expect(body.status).toStrictEqual("ERROR");
		expect(body.message).toStrictEqual("Internal Server Error");
	});
	it("should handle internal server error on clear cart", async () => {
		jest.spyOn(UserUtils, "getRequestUserId").mockImplementationOnce(() => {
			throw new Error("Internal server error");
		});

		const { body } = await Jest_request.put(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.expect(500);

		expect(body.status).toStrictEqual("ERROR");
		expect(body.message).toStrictEqual("Internal Server Error");
	});
	it("should handle internal server error on clear cart", async () => {
		jest.spyOn(UserUtils, "getRequestUserId").mockImplementationOnce(() => {
			throw new Error("Internal server error");
		});

		const { body } = await Jest_request.post(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.expect(400);
	});
	it("should handle internal server error on update cart", async () => {
		jest.spyOn(UserUtils, "getRequestUserId").mockImplementationOnce(() => {
			throw new Error("Internal server error");
		});

		const { body } = await Jest_request.patch(`/api/v1/carts/`)
			.set("Authorization", `Bearer ${token}`)
			.send({ productId: product_id, quantity: 2 })
			.expect(500);

		expect(body.status).toStrictEqual("ERROR");
		expect(body.message).toStrictEqual("Internal Server Error");
	});
});
