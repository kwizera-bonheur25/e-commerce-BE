import { Op } from "sequelize";
import { queryParamsAttribute } from "../types/searchProductParams";
import { findCategory } from "../utils/search.util";

const searchCondtion = async (queryParams: queryParamsAttribute) => {
	const { name, minPrice, maxPrice, categoryName } = queryParams;
	const condition: any = {};
	if (name) {
		condition.name = { [Op.iLike]: `%${name}%` };
	}
	if (maxPrice && minPrice) {
		condition.price = {
			[Op.between]: [minPrice, maxPrice],
		};
	} else if (minPrice) {
		condition.price = {
			[Op.gte]: [minPrice],
		};
	} else if (maxPrice) {
		condition.price = {
			[Op.lte]: [maxPrice],
		};
	}

	if (categoryName) {
		const category = await findCategory(categoryName);
		if (category?.length !== 0) {
			condition.categoryId = {
				[Op.eq]: category,
			};
		}
	}
	const whereClause = { [Op.and]: condition };
	return whereClause;
};
export default searchCondtion;
