import { Server } from "socket.io";
import * as http from "http";
import { insert_function, read_function } from "./db_methods";
import { messageModelAttributes } from "../types/model";
import { User } from "../database/models/User";
import { Notification as DBNotification } from "../database/models/notification";
import { ExtendedSocket, isLogin } from "../middlewares/auth";
import { NotificationEmition } from "../types/model";

let io: Server;

export const config = (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.use(async (socketInstance, next) => {
		if (await isLogin(socketInstance)) {
			next();
		} else {
			socketInstance.disconnect(true);
		}
	});

	io.on("connection", async (socket: ExtendedSocket) => {
		const userId = socket.user?.id;

		if (!userId) {
			console.error("User ID is not defined");
			socket.disconnect(true);
			return;
		}

		const include = [
			{
				model: User,
				as: "sender",
				attributes: ["id", "firstName", "lastName", "email", "role"],
			},
		];

		try {
			const messages = await read_function<messageModelAttributes>(
				"message",
				"findAll",
				{ include },
			);

			socket.emit("chat messages", messages);

			const unreadNotifications = await DBNotification.findAll({
				where: { userId, unread: true },
			});

			socket.emit("notifications", unreadNotifications);
		} catch (error) {
			console.error("Error fetching data on connection:", error);
		}

		socket.on("send message", async (msg) => {
			try {
				const message = {
					senderId: userId,
					message: msg.message,
				};
				const sentMessage = await insert_function<messageModelAttributes>(
					"message",
					"create",
					message,
				);

				if (sentMessage.id) {
					const newMessage = await read_function("message", "findOne", {
						where: { id: sentMessage.id },
						include,
					});
					io.emit("new message", newMessage);
				}
			} catch (error) {
				console.error("Error sending message:", error);
			}
		});

		socket.on("notification", (data) => {
			io.emit("notification", data);
		});
	});
};

export const emitNotification = (notifications: NotificationEmition[]) => {
	if (io) {
		notifications.forEach((notification) => {
			io.emit("notification", notification);
		});
	} else {
		console.error("Socket.io is not initialized.");
	}
};
