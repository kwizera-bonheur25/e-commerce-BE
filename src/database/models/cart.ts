import { DataTypes, Model, Sequelize } from "sequelize";
import { cartCreationAttributes, cartModelAttributes } from "../../types/model";

import { User } from "./User";
import { cartItem } from "../../types/cart";

class Cart extends Model<cartModelAttributes, cartCreationAttributes> {
	public id!: string;
	public userId!: string;
	public products!: cartItem[];
	public total!: number;

	public static associate(models: { User: typeof User }) {
		this.belongsTo(models.User, {
			foreignKey: "userId",
			as: "owner",
		});
	}
}
const cart_model = (sequelize: Sequelize) => {
	Cart.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			products: DataTypes.ARRAY(DataTypes.JSONB),
			total: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: "Cart",
			tableName: "carts",
		},
	);
	return Cart;
};

export default cart_model;
