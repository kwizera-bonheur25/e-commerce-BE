import Joi from "joi";

const logInValidation = Joi.object({
	email: Joi.string().required().email().messages({
		"string.empty": "Email field can't be empty!",
		"string.email": "Invalid email!",
	}),
	password: Joi.string().required().messages({
		"string.empty": "Password field can't be empty!",
	}),
}).options({ allowUnknown: false });

const validateLogIn = (body: any) => {
	const { error } = logInValidation.validate(body);
	return error;
};

export default validateLogIn;
