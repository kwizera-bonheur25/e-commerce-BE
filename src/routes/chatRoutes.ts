import express from "express";
import userAuthentication from "../middlewares/auth";
import { chat, chatLogin, read_all_messages } from "../controllers/chat";

const chatRoutes = express.Router();
chatRoutes.get("/", chat);
chatRoutes.get("/login", chatLogin);
chatRoutes.get(
	"/messages",
	userAuthentication.authenticateUser,
	read_all_messages,
);

export default chatRoutes;
