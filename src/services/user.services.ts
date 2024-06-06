import database_models from "../database/config/db.config";
import { UserModelAttributes } from "../types/model";
import { read_function } from "../utils/db_methods";

export const getRoleByName = async (roleName: string) => {
	return await database_models.role.findOne({
		where: { roleName },
	});
};

export const findAllUsers = async () => {
	return Object.values(
		await read_function<UserModelAttributes>("User", "findAll"),
	);
};
