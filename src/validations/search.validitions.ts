import Joi from "joi";
import { queryParamsAttribute } from "../types/searchProductParams";

const searchValidater = Joi.object({
	name: Joi.string(),
	categoryName: Joi.string(),
	minPrice: Joi.number(),
	maxPrice: Joi.number(),
}).options({ allowUnknown: false });

export const searchValidate = (queryParams: queryParamsAttribute) => {
	return searchValidater.validate(queryParams);
};
