import database_models from "../database/config/db.config";

export default class cartService {
	static findCartByUserIdService = async (userId: string) => {
		return await database_models.Cart.findOne({ where: { userId } });
	};
	static createCartService = async (userId: string, item: any) => {
		const newCart = await database_models.Cart.create({
			products: [item],
			userId: userId,
			total: 0,
		});
		return newCart;
	};
	static updateCartProductsAndTotalService = async (
		cart: any,
		newTotal: number,
	) => {
		return await database_models.Cart.update(
			{ products: cart.products, total: newTotal },
			{ where: { id: cart.id } },
		);
	};
	static updateCartService = async (userId: string, cart: any) => {
		return await database_models.Cart.update(
			{ ...cart.dataValues },
			{ where: { userId } },
		);
	};
}
