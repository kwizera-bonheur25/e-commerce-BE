import app from "./app";
import { connectionToDatabase } from "./database/config/db.config";
import * as http from "http";
import { config } from "./utils/socket.util";
import { startCheckPasswordExpiration } from "./helpers/cronJobs";
import { CLONE_TIME, PORT } from "./utils/keys";
import { myEventListener } from "./utils/notificationListeners";

myEventListener();

const startServer = async () => {
	await connectionToDatabase();

	const server = http.createServer(app);
	config(server);

	server.listen(PORT, async () => {
		console.log(`Server is running at http://localhost:${PORT}`);
		await startCheckPasswordExpiration(CLONE_TIME);
	});
};

startServer();
