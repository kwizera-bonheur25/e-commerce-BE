import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import passport from "./middlewares/passport";
import { SESSION_SECRET } from "./utils/keys";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import { root_home_page } from "./utils/html.utils";
import docs from "./documention";
import { GOOGLE_CLIENT_ID, GOOGLE_SECRET_ID } from "./utils/keys";

const app = express();

const swaggerOptions = {
	validatorUrl: null,
	oauth: {
		clientId: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_SECRET_ID,
		appName: "E-Commerce",
	},
};

app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(
	"/api/v1/docs",
	swaggerUi.serve,
	swaggerUi.setup(docs, { swaggerOptions: swaggerOptions }),
);

app.use("/api/v1", router);
app.get("/api/v1", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "Welcome to Hacker's e-commerce backend!",
	});
});
app.get("/", (_req: Request, res: Response) => {
	res.send(root_home_page);
});
export default app;
