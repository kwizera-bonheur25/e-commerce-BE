import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { UserCreationAttributes, UserModelAttributes } from "../../types/model";
import { Product } from "./product";
import database_models from "../config/db.config";
import { Payments } from "./payments";

const default_date = new Date(Date.now());

export class User extends Model<UserModelAttributes, UserCreationAttributes> {
	public id!: string;
	public userName!: string;
	public firstName!: string;
	public lastName!: string;
	public email!: string;
	public password!: string;
	public confirmPassword!: string;
	public role!: string;
	public isVerified!: boolean;
	public isPasswordExpired!: boolean;
	public lastTimePasswordUpdated!: Date;
	public isActive!: boolean;
	public gender!: string;
	public birthDate!: Date;
	public phoneNumber!: string;
	public preferredLanguage!: string;
	public preferredCurrency!: string;
	public profileImage!: string;
	public addressLine1!: string;
	public addressLine2!: string;
	public country!: string;
	public city!: string;
	public zipCode!: number;

	public static associate(models: {
		Product: typeof Product;
		role: typeof database_models.role;
		Payments: typeof Payments;
		review: typeof database_models.review;
		Notification: typeof database_models.Notification;
	}) {
		this.hasOne(models.Product, {
			foreignKey: "sellerId",
			as: "products",
		});
		User.belongsTo(models.role, { as: "Roles", foreignKey: "role" });
		this.hasMany(models.Payments, {
			foreignKey: "payerId",
			as: "payments",
		});
		this.hasMany(models.review, { as: "user", foreignKey: "userId" });

		this.hasMany(models.Notification, {
			foreignKey: "userId",
			as: "notifications",
		});
	}
}

const user_model = (sequelize: Sequelize) => {
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			confirmPassword: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				allowNull: false,
				references: {
					model: "roles",
					key: "id",
				},
			},
			isVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: UUIDV4,
				allowNull: false,
			},
			isPasswordExpired: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			lastTimePasswordUpdated: {
				type: DataTypes.DATE,
				defaultValue: default_date,
				allowNull: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			gender: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			birthDate: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			phoneNumber: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			preferredLanguage: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			preferredCurrency: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			profileImage: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			addressLine1: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			addressLine2: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			country: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			city: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			zipCode: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			tableName: "users",
		},
	);

	return User;
};
export default user_model;
