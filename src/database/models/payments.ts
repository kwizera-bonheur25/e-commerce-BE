import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
	PaymentsModelAttributes,
	paymentsCreationAttributes,
} from "../../types/model";
import { User } from "./User";

export class Payments extends Model<
	PaymentsModelAttributes,
	paymentsCreationAttributes
> {
	public id!: string;
	public payerId!: string;
	public paymentMethod!: string;
	public paymentId!: string;
	public status!: string;
	public phoneNumber!: string;

	public static associate(models: { User: typeof User }) {
		this.belongsTo(models.User, {
			foreignKey: "payerId",
			as: "Payer",
		});
	}
}

const paymemt_model = (sequelize: Sequelize) => {
	Payments.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			payerId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			paymentMethod: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			paymentId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "SUCCESSFUL",
			},
			phoneNumber: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "payments",
		},
	);
	return Payments;
};

export default paymemt_model;
