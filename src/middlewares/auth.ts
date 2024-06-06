import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import database_models from "../database/config/db.config";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { HttpException, sendResponse } from "../utils/http.exception";
import {
	OrderWithUserAssociations,
	ProductWithAssociations,
	reviewsAttribute,
	salesCreationAttributes,
} from "../types/model";

export interface ExpandedRequest extends Request {
	cart?: any;
	user?: JwtPayload;
	product?: ProductWithAssociations;
	review?: reviewsAttribute;
	sales?: salesCreationAttributes;
	order?: OrderWithUserAssociations;
}

export interface ExtendedSocket extends Socket {
	user?: JwtPayload;
}

//only for logged in user and used for socket middleware not compatible with express req(s)

export const isLogin = async (socket: ExtendedSocket): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			reject(new Error("UNAUTHORIZED: Token is missing"));
		}

		try {
			const verifiedToken = jwt.verify(
				token,
				ACCESS_TOKEN_SECRET as string,
			) as JwtPayload;

			socket.user = verifiedToken;
			resolve(true);
		} catch (error) {
			reject(new Error("UNAUTHORIZED: Invalid token"));
		}
	});
};

// only logged in users
const authenticateUser = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ status: "UNAUTHORIZED", message: "Please login to continue" });
	}
	//TODO: Duplicate code.(user verified or decoded)
	const decoded = jwt.decode(token) as JwtPayload;
	if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
		return res
			.status(401)
			.json({ message: "Token has expired, please login again!" });
	}

	try {
		const verifiedToken = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;
		const isInBlcaklist = await database_models.Blacklist.findOne({
			where: { token },
		});

		if (!verifiedToken || isInBlcaklist) {
			return res.status(401).json({ message: "please login to continue!" });
		}

		req.user = verifiedToken;

		if (req.user.isPasswordExpired) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Password has expired, Please update your password!",
			);
		}

		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res
				.status(401)
				.json({ message: "Token has expired, please login again!" });
		} else if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid token!" });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
};

const is_authenticated_when_password_expired = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ status: "UNAUTHORIZED", message: "Please login to continue" });
	}
	const decoded = jwt.decode(token) as JwtPayload;
	if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
		return res
			.status(401)
			.json({ message: "Token has expired, please login again!" });
	}

	try {
		const verifiedToken = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;
		const isInBlacklist = await database_models.Blacklist.findOne({
			where: { token },
		});

		if (!verifiedToken || isInBlacklist) {
			return res.status(401).json({ message: "Please login to continue!" });
		}

		req.user = verifiedToken;

		if (req.user.isPasswordExpired) {
			return next();
		}

		return next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res
				.status(401)
				.json({ message: "Token has expired, please login again!" });
		} else if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid token!" });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
};

// only buyers
const isBuyer = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return sendResponse(res, 404, "Bad Request", "Please Login");
	}
	try {
		const decoded = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;

		const isInBlcaklist = await database_models.Blacklist.findOne({
			where: { token },
		});

		if (!decoded || isInBlcaklist) {
			return sendResponse(
				res,
				401,
				"UNAUTHORIZED",
				"Please login to continue!",
			);
		}

		if (decoded.role !== "BUYER") {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Only buyer can perform this action!",
			);
		}
		req.user = decoded;

		if (req.user.isPasswordExpired) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Password has expired, Please update your password!",
			);
		}
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid token,Try Login Again" });
		} else {
			return res
				.status(500)
				.json({ message: "Internal server error", error: error });
		}

		// return sendResponse(
		// 	res,
		// 	500,
		// 	"INTERNAL SERVER ERROR",
		// 	"Internal server error",
		// );
	}
};

const isSeller = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
	}

	const decodedToken = jwt.decode(token) as JwtPayload;
	if (
		decodedToken &&
		decodedToken.exp &&
		Date.now() >= decodedToken.exp * 1000
	) {
		return res
			.status(401)
			.json(
				new HttpException(
					"UNAUTHORIZED",
					"You have been loggedOut, Please login to continue!",
				),
			);
	}

	try {
		const payLoad = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;

		const isInBlcaklist = await database_models.Blacklist.findOne({
			where: { token },
		});

		if (!payLoad || isInBlcaklist) {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
		}

		req.user = payLoad;

		if (req.user?.role != "SELLER") {
			return res
				.status(403)
				.json(
					new HttpException(
						"FORBIDDEN",
						" Only seller can perform this action!",
					),
				);
		}

		if (req.user.isPasswordExpired) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Password has expired, Please update your password!",
			);
		}

		next();
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
		} else {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
		}
	}
};

//only admins
const isAdmin = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Please Login Again" });
	}
	try {
		const decoded = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;

		const isInBlcaklist = await database_models.Blacklist.findOne({
			where: { token },
		});
		if (!decoded || isInBlcaklist) {
			return res.status(401).json({ message: "Expired token,Try Login Again" });
		}
		const role = decoded.role;
		if (role) {
			if (role === "ADMIN") {
				if (decoded.isPasswordExpired) {
					return sendResponse(
						res,
						403,
						"FORBIDDEN",
						"Password has expired, Please update your password!",
					);
				}

				next();
			} else {
				return res
					.status(403)
					.json({ message: "you are not allowed to access this route!" });
			}
		}
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid token,Try Login Again" });
		} else {
			return res
				.status(500)
				.json({ message: "Internal server error", error: error });
		}
	}
};

export default {
	is_authenticated_when_password_expired,
	authenticateUser,
	isBuyer,
	isSeller,
	isAdmin,
	isLogin,
};
