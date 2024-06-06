export type cartItem = {
	id: string;
	name: string;
	image: string;
	quantity: number;
	price: number;
	totalPrice: number;
};

export type cartType = {
	id: string;
	userId: string;
	products: cartItem[];
	total: number;
	createdAt: string;
	updatedAt: string;
};
