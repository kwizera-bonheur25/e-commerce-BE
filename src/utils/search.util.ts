import { Op } from "sequelize";
import database_models from "../database/config/db.config";

export const findCategory = async (categoryName: string) => {
	const category = await database_models.Category.findOne({
		where: { name: { [Op.iLike]: `%${categoryName}%` } },
	});
	return category?.dataValues.id;
};
