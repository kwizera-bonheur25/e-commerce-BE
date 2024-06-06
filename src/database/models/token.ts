import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
	TokenModelAttributes,
	TokenCreationAttributes,
} from "../../types/model";

export class Token extends Model<
	TokenModelAttributes,
	TokenCreationAttributes
> {
	public id!: string;
	public token!: string;
}
const token_model = (sequelize: Sequelize) => {
	Token.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING(10000),
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			tableName: "tokens",
		},
	);
	return Token;
};

export default token_model;
