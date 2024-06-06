import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { User } from "./User";
import { OrderAttributes, OrderCreationAttributes } from "../../types/model";

export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
	public id!: string;
	public userId!: string;
	public productId!: string;
	public orderStatus!: number;
	public createdAt!: Date;
	public updatedAt!: Date;

	public static associate(models: { User: typeof User }) {
		this.belongsTo(models.User, {
			foreignKey: "sellerId",
			as: "seller",
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
				allowNull: false,
			},

			orderStatus: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			productId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "products",
					key: "id",
				},
			},

			createdAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},
		},

		{
			timestamps: true,
			sequelize,
			tableName: "orders",
		},
	);

	return Order;
};

export default order_model;
