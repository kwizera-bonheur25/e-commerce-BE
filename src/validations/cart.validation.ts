import Joi from "joi";

const cartValidator = Joi.object({
	productId: Joi.string().required(),
	quantity: Joi.number().required().min(1),
});

const validateCart = (cartData: any) => {
	return cartValidator.validate(cartData);
};
export default validateCart;
