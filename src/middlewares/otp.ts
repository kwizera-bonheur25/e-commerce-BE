import validateOtp from "../validations/otp.validate";
import { HttpException } from "../utils/http.exception";
import { Request, Response, NextFunction } from "express";

const otpIsValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const error = validateOtp(req.body);
		if (error) {
			return res
				.status(400)
				.json(
					new HttpException(
						"BAD REQUEST",
						error.details[0].message.replace(/"/g, ""),
					),
				);
		}
		next();
	} catch (error) {
		res.status(500).json({
			status: "SERVER FAIL",
			message: "Something went wrong!!",
			error: error,
		});
	}
};

export default otpIsValid;
