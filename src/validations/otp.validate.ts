import Joi from "joi";

const accountVerifyValidation = Joi.object({
	otp: Joi.string().length(6).required().messages({
		"string.empty": "OTP is required!",
		"string.length": "OTP must be exactly 6 characters long!",
	}),
}).options({ allowUnknown: false });

const validateOtp = (body: any) => {
	const { error } = accountVerifyValidation.validate(body);
	return error;
};

export default validateOtp;
