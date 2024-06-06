/* eslint-disable no-shadow */
import { CreateOptions, FindOptions, UpdateOptions } from "sequelize";
import database_models from "../database/config/db.config";

type ModelTypes =
	| "Product"
	| "Category"
	| "User"
	| "Blacklist"
	| "Token"
	| "resetPassword"
	| "role"
	| "message"
	| "wish"
	| "Payments"
	| "Cart"
	| "Order"
	| "Sales"
	| "review"
	| "Notification";
type MethodTypes = "findAll" | "findOne" | "destroy" | "create" | "update";

export const read_function = async <T>(
	model: ModelTypes,
	method: MethodTypes,
	condition?: FindOptions,
) => {
	if (!database_models[model] || !database_models[model][method]) {
		throw new Error(
			`Invalid ${!database_models[model] ? "modelName" : ""} ${!database_models[model] && !database_models[model][method] ? "and" : ""} ${!database_models[model][method] ? "method" : ""}`,
		);
	}
	const result = await (
		database_models[model][method] as (condition: FindOptions) => Promise<T>
	)(condition as FindOptions);
	return result;
};

export const insert_function = async <T>(
	model: ModelTypes,
	method: MethodTypes,
	data: any,
	condition?: FindOptions | UpdateOptions,
): Promise<T> => {
	if (!database_models[model] || !database_models[model][method]) {
		throw new Error(
			`Invalid ${!database_models[model] ? "modelName" : ""} ${!database_models[model] && !database_models[model][method] ? "and" : ""} ${!database_models[model][method] ? "method" : ""}`,
		);
	}

	if (method === "create") {
		const result = await (
			database_models[model][method] as (
				data: any,
				options?: CreateOptions,
			) => Promise<T>
		)(data, condition as CreateOptions);
		return result;
	} else if (method === "update") {
		if (!condition) {
			throw new Error("Condition is required for update operation");
		}
		const result = await (
			database_models[model][method] as (
				values: any,
				options?: UpdateOptions,
			) => Promise<T>
		)(data, condition as UpdateOptions);
		return result;
	} else {
		throw new Error("Invalid method type");
	}
};
