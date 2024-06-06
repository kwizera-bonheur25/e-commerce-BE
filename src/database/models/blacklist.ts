import { DataTypes, Model, Sequelize } from "sequelize";
import { BlacklistModelAtributes } from "../../types/model";

export class Blacklist extends Model<BlacklistModelAtributes> {
	public id!: string;
	public token!: string;
}

const blacklist_model = (sequelize: Sequelize) => {
	Blacklist.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "blacklisted_tokens",
		},
	);

	return Blacklist;
};

export default blacklist_model;
