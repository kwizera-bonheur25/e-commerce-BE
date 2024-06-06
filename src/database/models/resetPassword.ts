import { DataTypes, Model, Sequelize } from "sequelize";
import { resetPasswordModelAtributes } from "../../types/model";

export class resetPassword extends Model<resetPasswordModelAtributes> {}

const reset_model = (sequelize: Sequelize) => {
	resetPassword.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			resetToken: {
				type: DataTypes.STRING(1000),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "resetPassword_tokens",
		},
	);
	return resetPassword;
};

export default reset_model;
