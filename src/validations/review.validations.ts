import Joi from "joi";
const reviewValidation = Joi.object({
	feedBack: Joi.string().messages({
		"string.empty": "feedBack field can't be empty!",
	}),
	ratings: Joi.number().min(1).max(5).precision(1).messages({
		"number.base": "Ratings must be a number!",
		"number.min": "Ratings must be at least 1!",
		"number.max": "Ratings must be at most 5!",
		"number.precision": "Ratings can have at most 1 decimal place!",
	}),
	productId: Joi.allow(),
});

const validateReview = (body: any) => {
	const { error } = reviewValidation.validate(body);
	return error;
};

export { validateReview };
