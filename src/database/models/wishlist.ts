import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { User } from "./User";
import { Product } from "./product";

import { WishesAttributes, WishesCreationAttributes } from "../../types/model";

export class Wishes extends Model<WishesAttributes, WishesCreationAttributes> {
	public id!: string;
	public userId!: string;
	public productId!: string;

	public static associate(models: {
		User: typeof User;
		Product: typeof Product;
	}) {
		this.belongsTo(models.User, {
			foreignKey: "userId",
			as: "user",
		});

		this.belongsTo(models.Product, {
			foreignKey: "productId",
			as: "product",
		});
	}
}

const wish_model = (sequelize: Sequelize) => {
	Wishes.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
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
		},
		{
			sequelize,
			tableName: "wishes",
		},
	);

	return Wishes;
};

export default wish_model;
