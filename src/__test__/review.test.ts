import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import database_models from "../database/config/db.config";
import {
	review_user,
	review_user_login,
	two_factor_authentication_data,
	new_category,
	new_seller_user,
	new_product,
	second_review_user,
	second_review_user_login,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { or } from "sequelize";
import {
	createReview,
	deleteReviews,
	getAllReview,
	getReviewsOnProduct,
	updateReviews,
} from "../controllers/review.controller";
import { isAvailable } from "../utils/nodeEvents";

function logErrors(
	err: { stack: any },
	_req: any,
	_res: any,
	next: (arg0: any) => void,
) {
	console.log(err.stack);
	next(err);
}

jest.setTimeout(30000);
const Jest_request = request(app.use(logErrors));
let category_id: string;
let seller_token: string;
let product_id: any;
let second_review_token: string;
let review_token: string;
let order: any;
let sales: any;
describe("REVIEW API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
		order = await database_models.Order.findAll();
		sales = await database_models.Sales.findAll();
	});

	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Product, "products");
		await deleteTableData(database_models.Category, "categories");
		await deleteTableData(database_models.User, "reviews");
	});
	/**
	 *                       Creating seller and product
	 */
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

	/**
	 *  Creating buyer and make an order
	 *
	 */

	it("it should  register a buyer and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(review_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});
	it("it should  register a second buyer and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(second_review_user)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
	});
	it("it should  login a user and return 201", async () => {
		await database_models.User.update(
			{ isVerified: true },
			{
				where: { email: review_user_login.email },
			},
		);
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(review_user_login)
			.expect(200);
		review_token = body.data;
	});
	it("it should  login a second_review_user and return 201", async () => {
		await database_models.User.update(
			{ isVerified: true },
			{
				where: { email: second_review_user_login.email },
			},
		);
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(second_review_user_login)
			.expect(200);
		second_review_token = body.data;
	});

	it("it should  create a review and return 201", async () => {
		const x = await database_models.Product.update(
			{ isAvailable },
			{ where: { id: product_id } },
		);

		const users = await database_models.User.findOne({
			where: { email: "peterBuyer5@gmail.com" },
		});

		const orderData = {
			buyerId: users?.dataValues.id as string,
			status: "delivered",
		};
		const order = await database_models.Order.create({ ...orderData });
		const salesData = {
			orderId: order.dataValues.id,
			buyerId: users?.dataValues.id as string,
			productId: product_id,
			status: "delivered",
			deliveryDate: new Date("2024-05-22 20:54:53.488+02"),
			quantitySold: 3,
		};
		const sales = await database_models.Sales.create({ ...salesData });
		const Reviews = {
			productId: product_id,
			feedBack: "any feed back",
			ratings: "2",
		};

		const { body } = await Jest_request.post("/api/v1/reviews/")
			.set("Authorization", `Bearer ${review_token}`)
			.send(Reviews)

			.expect(201);

		expect(body.message).toStrictEqual("review added successfully!");
	});

	it("it should return  all reviews on  product and return 201", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/products/${product_id}/reviews/`,
		).expect(201);
		expect(body.message).toStrictEqual("review retrieved successfully!");
	});

	it("it should return review updated successfully and return 201", async () => {
		const users = await database_models.User.findOne({
			where: { email: "peterBuyer5@gmail.com" },
		});
		const reviewId = await database_models.review.findOne({
			where: { userId: users?.dataValues.id },
		});
		const updateReviews = {
			feedBack: "update feed back",
			ratings: "2",
		};
		const { body } = await Jest_request.patch(
			`/api/v1/reviews/${reviewId?.dataValues.id}`,
		)
			.set("Authorization", `Bearer ${review_token}`)
			.send(updateReviews)
			.expect(201);
		expect(body.message).toStrictEqual("review Updated successfully!");
	});

	it("it should return review deleted successfully and return 201", async () => {
		const users = await database_models.User.findOne({
			where: { email: "peterBuyer5@gmail.com" },
		});
		const reviewId = await database_models.review.findOne({
			where: { userId: users?.dataValues.id },
		});
		const { body } = await Jest_request.delete(
			`/api/v1/reviews/${reviewId?.dataValues.id}`,
		)
			.set("Authorization", `Bearer ${review_token}`)
			.expect(201);
		expect(body.message).toStrictEqual("review deleted successfully!");
	});

	it("it should return all reviews and return 201", async () => {
		const { body } = await Jest_request.get(`/api/v1/reviews/`).expect(201);
		expect(body.message).toStrictEqual("review retrieved successfully!");
	});
	it("it should return server error and return 500 when geting review on product", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await getReviewsOnProduct(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("it should return server error and return 500 when creating review", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await createReview(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("it should return server error and return 500 when updating review on product", async () => {
		const req: any = {};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await updateReviews(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("it should return server error and return 500 when deleting review on product", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await deleteReviews(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
	});
	// it("it should return server error and return 500 when getting all review on product", async () => {
	// 	const req: any = {};

	// 	const res: any = {
	// 		status: jest.fn().mockReturnThis(),
	// 		json: jest.fn(),
	// 	};
	// 	await getAllReview(req, res);
	// 	expect(res.status).toHaveBeenCalledWith(500);
	// });
});
