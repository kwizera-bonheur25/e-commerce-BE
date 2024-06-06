import Joi from "joi";

const ResetPasswordValidation = Joi.object({
	email: Joi.string().required().email().messages({
		"string.empty": "Email field can not be empty!",
		"string.email": "Invalid email!",
	}),
}).options({ allowUnknown: true });

const validateReset = (body: any) => {
	const { error } = ResetPasswordValidation.validate(body);
	return error;
};

export default validateReset;
