import app from "../app";
import request from "supertest";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { generateAccessToken } from "../helpers/security.helpers";
import {
	new_buyer_user_wishlist,
	new_category,
	new_product,
	new_seller_user,
	new_wishlist,
	token,
	two_factor_authentication_data,
} from "../mock/static";
import { Notification } from "../database/models/notification";
import { v4 as uuidV4 } from "uuid";
import { insert_function, read_function } from "../utils/db_methods";

// jest.mock("../utils/db_methods", () => ({
// 	read_function: jest.fn(),
// }));

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
let wishingBuyer: string;
let wishedProduct: string;
let notificationId: string;

describe("NOTIFICATIONS TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});
	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.wish, "wishes");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(Notification, "notifications");
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
		wishingBuyer = body.data.userId;
		wishedProduct = body.data.productId;

		// ///// fetch buyer wishlist ///
		const buyerProduct = await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
		expect(buyerProduct).toBeDefined();
		wishingBuyer = buyerProduct.body.data[0].userId;
		wishedProduct = buyerProduct.body.data[0].productId;

		///////////////// fetch seller wishlist

		await Jest_request.get("/api/v1/wishes")
			.set("Authorization", `Bearer ${seller_token}`)
			.expect(200);
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

	// =================================NOTIFICATIONS TESTS================================

	it("It should create notification when product added to wishlist", async () => {
		const newNotification = {
			id: uuidV4(),
			userId: wishingBuyer,
			message: `Product added to wishlist`,
			unread: true,
			createAt: new Date(),
			updatedAt: new Date(),
		};
		const newNotification1 = {
			id: uuidV4(),
			userId: wishingBuyer,
			message: `Product Removed from wishlist`,
			unread: true,
			createAt: new Date(),
			updatedAt: new Date(),
		};
		const createdNotification: Notification =
			await insert_function<Notification>(
				"Notification",
				"create",
				newNotification,
			);
		const createdNotification1: Notification =
			await insert_function<Notification>(
				"Notification",
				"create",
				newNotification1,
			);
		notificationId = createdNotification.id;
	});

	it("it should return 200 when user fetch all notifications", async () => {
		const { body } = await Jest_request.get("/api/v1/notifications")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
	});

	it("it should return 404 when user tries to fetch unavailable notification", async () => {
		const { body } = await Jest_request.get(
			"/api/v1/notifications/001b7a8c-c767-4aaf-ba61-b71238616bb0",
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(404);
	});
	it("it should return 200 and fetch one notification", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/notifications/${notificationId}`,
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
	});

	it("it should return 404 when user tries to mark unavailable notification as read", async () => {
		const { body } = await Jest_request.patch(
			"/api/v1/notifications/001b7a8c-c767-4aaf-ba61-b71238616bb0",
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Notification not found!");
	});

	it("it should return 200 and  mark single notification as read", async () => {
		const { body } = await Jest_request.patch(
			`/api/v1/notifications/${notificationId}`,
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
	});

	it("it should return 200 and  mark all notification as read", async () => {
		const { body } = await Jest_request.patch(`/api/v1/notifications`)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
	});

	it("it should return 404 when user tries to delete unavailable notification", async () => {
		const { body } = await Jest_request.delete(
			"/api/v1/notifications/001b7a8c-c767-4aaf-ba61-b71238616bb0",
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Notification not found!");
	});

	it("it should return 200 and delete single notification", async () => {
		const { body } = await Jest_request.delete(
			`/api/v1/notifications/${notificationId}`,
		)
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(200);
	});

	it("it should return 404 when user tries to make all unavaialble notifications as read", async () => {
		await Notification.destroy({ where: { userId: wishingBuyer } });
		const { body } = await Jest_request.patch("/api/v1/notifications")
			.set("Authorization", `Bearer ${buyer_token}`)
			.expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("No notifications found!");
	});
});
