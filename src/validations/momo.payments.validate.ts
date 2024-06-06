import Joi from "joi";

const allowedNumbers = [
	"46733123450",
	"46733123451",
	"46733123452",
	"46733123453",
	"46733123454",
];

export const momoValidation = Joi.alternatives()
	.try(
		Joi.string().valid(...allowedNumbers),
		Joi.string().pattern(/^(078|079)\d{7}$/),
	)
	.error((errors) => {
		errors.forEach((err) => {
			err.message = "Phone must start with 078 or 079 and be 10 digits long";
		});
		return errors;
	});
