import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { reviewsAttribute, reviewCreationAttributes } from "../../types/model";
import { User } from "./User";
import { Product } from "./product";

export class Reviews extends Model<reviewsAttribute, reviewCreationAttributes> {
	public id!: string;
	public userId!: string;
	public productId!: string;
	public feedBack!: string;
	public ratings!: number;
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

const reviewModel = (sequelize: Sequelize) => {
	Reviews.init(
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
			feedBack: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ratings: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					min: 1,
					max: 5,
				},
			},
		},
		{
			sequelize,
			tableName: "reviews",
		},
	);
	return Reviews;
};

export default reviewModel;
