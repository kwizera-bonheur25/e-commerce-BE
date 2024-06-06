import { Request, Response } from "express";
import app from "../app";
import { chat, chatLogin } from "../controllers/chat";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { Token } from "../database/models/token";
import { NewUser } from "../mock/static";
import { deleteTableData } from "../utils/database.utils";
import request from "supertest";

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

let token: string;

jest.setTimeout(30000);

describe("CHAT API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Token, "tokens");
	});

	it("should send index.html file", async () => {
		const req = {} as Request;
		const res = {
			sendFile: jest.fn(),
		} as unknown as Response;

		await chat(req, res);
		expect(res.sendFile).toHaveBeenCalledWith(
			expect.stringContaining("index.html"),
		);
	});

	it("should send login.html file", async () => {
		const req = {} as Request;
		const res = {
			sendFile: jest.fn(),
		} as unknown as Response;

		await chatLogin(req, res);

		expect(res.sendFile).toHaveBeenCalledWith(
			expect.stringContaining("login.html"),
		);
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

	it("it should return all  messages  and return 200 ", async () => {
		const { body } = await Jest_request.get("/api/v1/chats/messages").set(
			"Authorization",
			`Bearer ${token}`,
		);
		expect(body.message).toStrictEqual("Messages retrieved successfully!");
		expect(body.data).toBeDefined();
	});
});
