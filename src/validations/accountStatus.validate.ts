import Joi from "joi";

const accountStatusValidator = Joi.object({
	isAccountActive: Joi.string()
		.required()
		.messages({
			"any. only": "isAccountActive required",
			"string.empty": "field can't be empty",
		})
		.required(),
	reason: Joi.string().required().messages({
		"any.only": "reason required",
		"string.empty": "reason can't be empty",
	}),
}).options({ allowUnknown: false });

const accountStatusValidate = (body: any) => {
	const { error } = accountStatusValidator.validate(body);
	return error;
};

export default accountStatusValidate;
