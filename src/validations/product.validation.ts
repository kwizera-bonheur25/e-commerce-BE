import Joi from "joi";

export const productValidation = Joi.object({
	name: Joi.string().required().messages({
		"string.empty": "Name field can't be empty!",
	}),
	images: Joi.array(),
	price: Joi.number().required().min(0).messages({
		"any.required": "Price is required!",
		"number.base": "Price must be a number!",
		"number.min": "Price must be a non-negative number!",
	}),
	discount: Joi.number().min(0).messages({
		"any.required": "Discount is required!",
		"number.base": "Discount must be a number!",
		"number.min": "Discount must be a non-negative number!",
	}),
	quantity: Joi.number().required().min(0).messages({
		"any.required": "Quantity is required!",
		"number.base": "Quantity must be a number!",
		"number.min": "Quantity must be a non-negative number!",
	}),
	categoryId: Joi.string().required().messages({
		"string.empty": "CategoryId field can't be empty!",
		"any.required": "categoryId is required!",
	}),
	expiryDate: Joi.date().required().min("now").iso().messages({
		"date.base": "Expiry date must be a valid date",
		"date.min": "Expiry date must be in the future",
	}),
	sellerId: Joi.string(),
}).options({ allowUnknown: false });
