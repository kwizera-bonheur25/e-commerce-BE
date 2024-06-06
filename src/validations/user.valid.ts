import Joi from "joi";

const registerValidater = Joi.object({
	userName: Joi.string(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	isVerified: Joi.boolean(),
	email: Joi.string().email().required().messages({
		"string.empty": "Email field can't empty",
		"string.email": "Invalid Email",
	}),
	password: Joi.string()
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
		.messages({
			"string.empty": "Password field can't be empty",
			"string.pattern.base":
				"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
		})
		.required(),

	confirmPassword: Joi.string().required().equal(Joi.ref("password")).messages({
		"any.only": "Password don't match",
	}),
	role: Joi.string(),
}).options({ allowUnknown: false });

export const userValidate = (user: any) => {
	return registerValidater.validate(user);
};
