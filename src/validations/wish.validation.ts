import Joi from "joi";

export const wishValidation = Joi.object({
	productId: Joi.string()
		.guid({
			version: ["uuidv4", "uuidv5"],
		})
		.required()
		.messages({
			"string.empty": "product field can't be empty!",
			"string.guid": "product id must be a valid UUID",
		}),
}).options({ allowUnknown: false });
