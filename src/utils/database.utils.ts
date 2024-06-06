import database_models from "../database/config/db.config";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./keys";

export const deleteTableData = async (Model: any, tableName: string) => {
	try {
		const deletedRows = await Model.destroy({
			where: {},
			truncate: true,
			cascade: true,
		});
		if (deletedRows) {
			console.log(`${deletedRows} rows have been deleted from ${tableName}.`);
		}
	} catch (error) {
		console.log("Something went wrong in the process:", error);
	}
};

export const changeRole = async (token: string): Promise<void> => {
	const payLoad = Jwt.verify(
		token,
		ACCESS_TOKEN_SECRET as string,
	) as JwtPayload;

	await database_models.User.update(
		{ role: "SELLER" },
		{
			where: {
				id: payLoad.id,
			},
		},
	);
};
