import { read_function } from "../utils/db_methods";
import { ProductAttributes } from "../types/model";
export const findAllProducts = async () => {
	return Object.values(
		await read_function<ProductAttributes>("Product", "findAll"),
	);
};
