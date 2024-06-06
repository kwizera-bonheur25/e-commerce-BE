import app from "../app";
import request from "supertest";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { generateAccessToken } from "../helpers/security.helpers";
import {
	invalid_token,
	invalid_wishlist,
	new_buyer_user_wishlist,
	new_category,
	new_product,
	new_seller_user,
	new_wishlist,
	token,
	two_factor_authentication_data,
} from "../mock/static";
import wishlistController, {
	createWishlist,
} from "../controllers/wishlistController";

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
let buyer_token: string;
let seller_token: string;
let product_id: string;
let category_id: string;

describe("WISHLIST API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.wish, "wishes");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.Product, "products");
	});
	/////////////////////// SELLER REGISTER /////////////////
	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(new_seller_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});

	it("it should authenticate the user and return SUCCESS", async () => {
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

	it("it should create a new category and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/categories")
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_category)
			.expect(201);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.data).toBeDefined();

		category_id = body.data?.id;
	});

	it("It Seller should create a product", async () => {
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

	///////////////// BUYER REGISTER /////////////////
	it("it should  register a buyer and return 201", async () => {
		const user = await database_models.User.findOne();

		await database_models.User.update(
			{ role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
			{ where: { id: user?.dataValues.id } },
		);
		const authenticatetoken = generateAccessToken({
			id: user?.dataValues.id as string,
			role: "BUYER",
		});

		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(new_buyer_user_wishlist)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
		buyer_token = authenticatetoken;
	});

	///////////////// BUYER  CREATE WISH LIST /////////////////
	it("It should return 403 when a seller try to add a wishlist", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes")
			.set("Authorization", `Bearer ${seller_token}`)
			.send(new_wishlist)
			.expect(403);
		expect(body.message).toStrictEqual("Only buyer can perform this action!");
	});

	it("It should return 200 when buyer addd a product in wishlist and fetched all product", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.send({ productId: product_id })
			.expect(201);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Product added successfully in wishlist!",
		);
		console.log("productId", product_id);
		// ///// fetch buyer wishlist ///
		const buyerProduct = await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
		expect(buyerProduct).toBeDefined();

		///////////////// fetch seller wishlist

		await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);
	});

	//************  get single wish **********************
	it("It should return 200 when seller product found in wishlist", async () => {
		const { body } = await Jest_request.get(`/api/v1/wishes/${product_id}`)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Seller product fetched successfully");
		expect(body).toBeDefined();
	});

	it("It should return 404 when Seller product not found", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/wishes/9e555bd6-0f36-454a-a3d5-89edef4ff9d4`,
		)
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Product doesn't exist");
	});

	it("It should return 401 when not token for seller", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/wishes/${product_id}`,
		).expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
		expect(body.message).toStrictEqual("Please login to continue!");
	});

	it("It should return 404 when seller id is invalid", async () => {
		const { body } = await Jest_request.get("/api/v1/wishes").set(
			"Authorization",
			`Bearer ${token}`,
		);
	});
	//************************ end  ****************************
	it("It should return 400 when product to add in wishlist is not provided", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(400);
		expect(body.message).toStrictEqual("productId is required");
	});

	it("It should return 404 when product not found", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.send(invalid_wishlist)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Product not found");
	});

	it("It should return 200 when product removed from wishlist", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.send({ productId: product_id })
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Product successfully removed from wishlist",
		);
	});

	// ******************** GET WISHES ****************
	// ******************** BUYER  ****************
	it("It should return 404 when buyer don't have product in wishlist", async () => {
		const { body } = await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(404);

		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("No product found in the wishlist");
	});

	it("It should return 404 when fetch product which is found in wishlist", async () => {
		const { body } = await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("No products found in wishlist");
	});

	///////////////////////////////////////
	///////////////////////////////////////
	it("It should return 404 when fetching wishes for a buyer with no products in the wishlist", async () => {
		await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(404);
	});

	it("It should return 404 when fetching wishes for a seller with no products in the wishlist", async () => {
		await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(404);
	});

	it("It should return 400 when making a request with an invalid or incomplete request body", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(400);
		expect(body.message).toStrictEqual("productId is required");
	});

	it("It should return 404 when fetching wishes for a buyer with no products in the wishlist", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes").set(
			"Authorization",
			`Bearer ${invalid_token}`,
		);

		console.log(body);
	});

	it("should return 500 when get single wishlist  return something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await wishlistController.getSingleWishlist(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return 500 when create wishlist  return something went wrong", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await wishlistController.createWishlist(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("It should return 500 when buyer have invalid token", async () => {
		const { body } = await Jest_request.post("/api/v1/wishes").set(
			"Authorization",
			`Bearer ${invalid_token}`,
		);
		expect(body.message).toStrictEqual("Internal server error");
	});
});
