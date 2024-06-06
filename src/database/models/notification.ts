import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { User } from "./User";
import { NotificationAttributes } from "../../types/model";

export class Notification extends Model<NotificationAttributes> {
	public id!: string;
	public message!: string;
	public unread!: boolean;
	public userId!: string;

	public static associate(models: { User: typeof User }) {
		this.belongsTo(models.User, {
			foreignKey: "userId",
			as: "users",
		});
	}
}

const notification_model = (sequelize: Sequelize) => {
	Notification.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			message: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			unread: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
		},

		{
			sequelize,
			tableName: "notifications",
		},
	);

	return Notification;
};

export default notification_model;
