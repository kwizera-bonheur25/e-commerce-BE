import { Sequelize } from "sequelize";
import user_model from "./User";
import blacklist_model from "./blacklist";
import cart_model from "./cart";
import category_model from "./category";
import message_model from "./message";
//import order_model from "./order";
import paymemt_model from "./payments";
import product_model from "./product";
import reset_model from "./resetPassword";
import Role_model from "./role";
//import sales_model from "./sales";
import token_model from "./token";
import wish_model from "./wishlist";
import notification_model from "./notification";

import reviewModel from "./review";
import order_model from "./order";
import sales_model from "./sales";
const Models = (sequelize: Sequelize) => {
	const Product = product_model(sequelize);
	const Category = category_model(sequelize);
	const User = user_model(sequelize);
	const Blacklist = blacklist_model(sequelize);
	const Token = token_model(sequelize);
	const role = Role_model(sequelize);
	const resetPassword = reset_model(sequelize);
	const message = message_model(sequelize);
	const wish = wish_model(sequelize);
	const Cart = cart_model(sequelize);
	const Payments = paymemt_model(sequelize);
	const Order = order_model(sequelize);
	const Sales = sales_model(sequelize);
	const Notification = notification_model(sequelize);

	const review = reviewModel(sequelize);
	//const Order = order_model(sequelize);
	return {
		Product,
		Category,
		User,
		Blacklist,
		Token,
		role,
		resetPassword,
		message,
		wish,
		Cart,
		Payments,
		review,
		Order,
		Sales,
		Notification,
	};
};

export default Models;
