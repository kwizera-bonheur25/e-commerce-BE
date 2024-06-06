import Joi from "joi";

const updatePassValidater = Joi.object({
	oldPassword: Joi.string()
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
		.messages({
			"string.empty": "Password field can't be empty",
			"string.pattern.base":
				"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
		})
		.required(),
	newPassword: Joi.string()
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
		.messages({
			"any.only": "new Password required",
			"string.empty": "Password field can't be empty",
			"string.pattern.base":
				"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
		}),

	confirmPassword: Joi.string()
		.required()
		.equal(Joi.ref("newPassword"))
		.messages({
			"any.only": "New password and confirm password do not match",
		}),
}).options({ allowUnknown: false });

const updatePassValidate = (body: any) => {
	const { error } = updatePassValidater.validate(body);
	return error;
};

export default updatePassValidate;
