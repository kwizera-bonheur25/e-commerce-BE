import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { Product } from "./product";
import {
	CategoryAttributes,
	CategoryCreationAttributes,
} from "../../types/model";

export class Category extends Model<
	CategoryAttributes,
	CategoryCreationAttributes
> {
	declare id: string;
	declare name: string;
	declare description: string;

	public static associate(models: { Product: typeof Product }) {
		this.hasMany(models.Product, {
			foreignKey: "categoryId",
			as: "products",
			// onDelete: "CASCADE",
		});
	}
}

const category_model = (sequelize: Sequelize) => {
	Category.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "categories",
		},
	);

	return Category;
};

export default category_model;
