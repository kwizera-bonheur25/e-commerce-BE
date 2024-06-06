import Joi from "joi";

const newPasswordValidation = Joi.object({
	password: Joi.string().required().messages({
		"string.empty": "Password field can't be empty!",
	}),
}).options({ allowUnknown: false });

const validateNewPassword = (body: any) => {
	const { error } = newPasswordValidation.validate(body);
	return error;
};

export default validateNewPassword;
