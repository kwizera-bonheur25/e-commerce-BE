export default class CartUtils {
	static updateCart(cart: any, item: any) {
		const itemExist = cart.products.findIndex(
			(cItem: any) => cItem.id === item.id,
		);
		if (itemExist !== -1) {
			cart.products.splice(itemExist, 1);
		}
		cart.products.push(item);
		const newTotal = cart.products
			.map((prod1: any) => prod1.totalPrice)
			.reduce((sum: number, next: number) => sum + next);
		cart.total = newTotal;

		return { cart, newTotal };
	}
}
