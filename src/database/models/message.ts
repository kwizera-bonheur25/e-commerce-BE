import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { User } from "./User";
import { messageModelAttributes } from "../../types/model";

export class Message extends Model<messageModelAttributes> {
	public id!: string;
	public senderId!: string;
	public message!: string;

	public static associate(models: { User: typeof User }) {
		this.belongsTo(models.User, {
			foreignKey: "senderId",
			as: "sender",
		});
	}
}

const message_model = (sequelize: Sequelize) => {
	Message.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			senderId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			message: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: true,
			sequelize,
			tableName: "messages",
		},
	);
	return Message;
};

export default message_model;
