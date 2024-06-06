import Joi from "joi";

const salesValidation = Joi.object({
	status: Joi.string()
		.valid("Pending", "canceled", "delivered")
		.required()
		.messages({
			"string.empty": "status field can't be empty!",
			"any.only":
				"status field must be either 'Pending', 'canceled' or 'delivered'!",
		}),

	deliveryDate: Joi.date().iso().min("now").required().messages({
		"date.base": "deliveryDate must be a valid date",
		"date.min": "deliveryDate must be in the future",
	}),
}).options({ allowUnknown: false });

const salesValidate = (body: any) => {
	const { error } = salesValidation.validate(body);
	return error;
};

export default salesValidate;
