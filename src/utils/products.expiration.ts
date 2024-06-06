import { findAllProducts } from "../services/products.services";
import { ProductAttributes, UserModelAttributes } from "../types/model";
import { insert_function, read_function } from "./db_methods";
import { EventName, myEmitter } from "./nodeEvents";

export const checkProductExpiration = async () => {
	const products: ProductAttributes[] = await findAllProducts();
	const expiredProducts = products.filter((product) => {
		const expirationDate = new Date(product.expiryDate);
		const currentDate = new Date();

		return (
			expirationDate <= currentDate &&
			product.quantity > 0 &&
			product.isAvailable
		);
	});

	const sellers = [
		...new Set(expiredProducts.map((product) => product.sellerId)),
	];

	for (const sellerId of sellers) {
		const sellerProducts = expiredProducts.filter(
			(product) => product.sellerId === sellerId,
		);
		const condition_one = { where: { id: sellerId } };
		const user = await read_function<UserModelAttributes>(
			"User",
			"findOne",
			condition_one,
		);

		for (const product of sellerProducts) {
			const condition = { where: { id: product.id } };
			const isAvailable = false;
			await insert_function<ProductAttributes>(
				"Product",
				"update",
				{ isAvailable },
				condition,
			);
			myEmitter.emit(EventName.PRODUCT_GOT_EXPIRED, product, user);
		}
	}
};
