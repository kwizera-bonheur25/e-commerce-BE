import { Model, Sequelize, DataTypes, UUIDV4 } from "sequelize";
import {
	OrderModelAttributes,
	OrderCreationAttributes,
} from "../../types/model";
import { User } from "./User";
import { Sales } from "./sales";

export class Order extends Model<
	OrderModelAttributes,
	OrderCreationAttributes
> {
	public id!: string;
	public buyerId!: string;
	public status!: string;

	public static associate(models: { User: typeof User; Sales: typeof Sales }) {
		this.belongsTo(models.User, {
			foreignKey: "buyerId",
			as: "buyer",
		});
		this.hasMany(models.Sales, {
			foreignKey: "orderId",
			as: "sales",
		});
	}
}
const order_model = (sequelize: Sequelize) => {
	Order.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
			},
			buyerId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			status: {
				type: DataTypes.ENUM("pending", "canceled", "delivered"),
				defaultValue: "pending",
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "orders",
		},
	);
	return Order;
};
export default order_model;
