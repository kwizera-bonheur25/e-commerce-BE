import { Model, Sequelize, DataTypes, UUIDV4 } from "sequelize";
import {
	salesModelAttributes,
	salesCreationAttributes,
} from "../../types/model";
import { Order } from "./order";
import { User } from "./User";
import { Product } from "./product";
export class Sales extends Model<
	salesModelAttributes,
	salesCreationAttributes
> {
	public id!: string;
	public orderId!: string;
	public buyerId!: string;
	public productId!: string;
	public status!: string;
	public deliveryDate!: Date;
	public quantitySold!: number;

	public static associate(models: {
		User: typeof User;
		Product: typeof Product;
		Order: typeof Order;
	}) {
		this.belongsTo(models.User, {
			foreignKey: "buyerId",
			as: "customer",
		});
		this.belongsTo(models.Order, {
			foreignKey: "orderId",
			as: "order",
		});

		this.belongsTo(models.Product, {
			foreignKey: "productId",
			as: "soldProducts",
		});
	}
}
const sales_model = (sequelize: Sequelize) => {
	Sales.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			orderId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "orders",
					key: "id",
				},
			},
			buyerId: {
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
			status: {
				type: DataTypes.ENUM("pending", "canceled", "delivered"),
				defaultValue: "pending",
				allowNull: false,
			},
			deliveryDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			quantitySold: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "sales",
		},
	);
	return Sales;
};
export default sales_model;
