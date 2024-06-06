import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";
import { categories } from "./category";
import { products } from "./product";
import { messages } from "./message";
import { wishes } from "./wishlist";
import { searches } from "./SearchProduct";
import { cartsDocRoutes } from "./carts/carts";
import { orders } from "./order";
import { sales } from "./sales";
import { app_payments } from "./payments";
import { stats } from "./stats";
import { review } from "./review";
import { notifications } from "./notifications/notifications";

export default {
	...basicInfo,
	paths: {
		...users,
		...roles,
		...categories,
		...searches,
		...products,
		...messages,
		...wishes,
		...cartsDocRoutes,
		...app_payments,
		...stats,
		...review,
		...orders,
		...sales,
		...notifications,
	},
};
