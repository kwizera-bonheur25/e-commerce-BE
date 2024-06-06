import { sendEmail } from "../helpers/nodemailer";
import { EventName, myEmitter } from "./nodeEvents";
import { User } from "../database/models/User";
import { Product } from "../database/models/product";
import { Notification as DBNotification } from "../database/models/notification";
import { emitNotification } from "./socket.util";
import { OrderModelAttributes } from "../types/model";

export const myEventListener = () => {
	myEmitter.on(
		EventName.PRODUCT_ADDED_TO_WISHLIST,
		async (userId: string, productId: string) => {
			try {
				const user = await User.findOne({ where: { id: userId } });
				const product = await Product.findOne({ where: { id: productId } });

				if (!user) {
					console.log("User not found");
					return;
				}
				if (!product) {
					console.log("Product not found");
					return;
				}

				const sellerId = product.dataValues.sellerId;
				const seller = await User.findOne({ where: { id: sellerId } });

				const buyerNotification = {
					userId: user.dataValues.id,
					message: `You have added ${product.dataValues.name} to the wishlist.`,
					unread: true,
				};

				const sellerNotification = {
					userId: sellerId,
					message: `Your product ${product.dataValues.name} has been added to the wishlist.`,
					unread: true,
				};

				const [buyerNotificationRecord, sellerNotificationRecord] =
					await Promise.all([
						DBNotification.create(buyerNotification),
						DBNotification.create(sellerNotification),
					]);

				const sendEmailOptions = {
					to: user.dataValues.email as string,
					subject: "Product Added to Wishlist",
					html: buyerNotificationRecord.message,
				};

				const sendEmailOptions_Seller = {
					to: seller?.dataValues.email as string,
					subject: "Product Added to Wishlist",
					html: sellerNotificationRecord.message,
				};

				await Promise.all([
					sendEmail(sendEmailOptions),
					sendEmail(sendEmailOptions_Seller),
				]);

				emitNotification([buyerNotificationRecord, sellerNotificationRecord]);
			} catch (error) {
				console.error("Error processing event:", error);
			}
		},
	);
	myEmitter.on(
		EventName.PRODUCT_REMOVED_FROM_WISHLIST,
		async (userId: string, productId: string) => {
			try {
				const user = await User.findOne({ where: { id: userId } });
				const product = await Product.findOne({ where: { id: productId } });
				const sellerId = product?.dataValues.sellerId;
				const seller = await User.findOne({ where: { id: sellerId } });

				if (!user) {
					console.log("User not found");
					return;
				}
				if (!product) {
					console.log("Product not found");
					return;
				}

				// BUYER SIDE
				const buyerNotification = {
					userId: user.dataValues.id || "",
					message: `You have removed ${product.dataValues.name} from the wishlist.`,
					unread: true,
				};

				// SELLER SIDE
				const sellerNotification = {
					userId: product?.dataValues.sellerId || "",
					message: `Your product ${product.dataValues.name} has been removed from the wishlist.`,
					unread: true,
				};

				const [buyerNotificationRecord, sellerNotificationRecord] =
					await Promise.all([
						DBNotification.create(buyerNotification),
						DBNotification.create(sellerNotification),
					]);

				const sendEmailOptions = {
					to: user.dataValues.email,
					subject: "Product Removed from Wishlist",
					html: buyerNotificationRecord?.message,
				};

				const sendEmailOptions_Seller = {
					to: seller?.dataValues.email as string,
					subject: "Product Removed from Wishlist",
					html: sellerNotificationRecord?.message,
				};

				await Promise.all([
					sendEmail(sendEmailOptions),
					sendEmail(sendEmailOptions_Seller),
				]);

				emitNotification([buyerNotificationRecord, sellerNotificationRecord]);
			} catch (error) {
				console.error("Error processing event:", error);
			}
		},
	);

	myEmitter.on(EventName.PRODUCT_GOT_EXPIRED, async (product, user) => {
		const sellerNotification = {
			userId: user.id,
			message: `Your product ${product.name} has expired.`,
			unread: true,
		};

		const [sellerNotificationRecord] = await Promise.all([
			DBNotification.create(sellerNotification),
		]);

		const sendEmailOptions = {
			to: user.email as string,
			subject: "Product Expired",
			html: sellerNotification?.message,
		};

		await Promise.all([sendEmail(sendEmailOptions)]);

		emitNotification([sellerNotificationRecord]);
	});

	myEmitter.on(
		EventName.PRRODUCT_BOUGHT,
		async (productId: string, order: OrderModelAttributes) => {
			try {
				const productInfo = await Product.findOne({ where: { id: productId } });
				const sellerId = productInfo?.dataValues.sellerId;
				const buyerId = order?.buyerId;

				if (!productInfo || !sellerId || !buyerId) {
					console.log("Product, seller, or buyer information not found");
					return;
				}

				const seller = await User.findOne({ where: { id: sellerId } });
				const buyer = await User.findOne({ where: { id: buyerId } });

				if (!seller || !buyer) {
					console.log("Seller or buyer not found");
					return;
				}

				const sellerNotification = {
					userId: sellerId,
					message: `Your product ${productInfo.dataValues.name} has been bought, go on and deliver it!`,
					unread: true,
				};

				const buyerNotification = {
					userId: buyerId,
					message:
						"Your order is pending now. Stay tuned to be able to track it!",
					unread: true,
				};

				const [buyerNotificationRecord, sellerNotificationRecord] =
					await Promise.all([
						DBNotification.create(buyerNotification),
						DBNotification.create(sellerNotification),
					]);

				const sellerEmail = {
					to: seller.email,
					subject: "Product Bought",
					html: sellerNotificationRecord.message,
				};

				const buyerEmail = {
					to: buyer.email,
					subject: "Product Bought",
					html: buyerNotificationRecord.message,
				};

				await Promise.all([sendEmail(sellerEmail), sendEmail(buyerEmail)]);

				emitNotification([buyerNotificationRecord, sellerNotificationRecord]);
			} catch (error) {
				console.error("Error processing product bought event:", error);
			}
		},
	);

	myEmitter.on(
		EventName.ORDERS_DELIVERED,
		async (order: OrderModelAttributes) => {
			const buyerId = order.buyerId;

			if (!order) {
				console.log("Order not found!");
				return;
			}

			const notificationInput = {
				userId: buyerId,
				message: `Your order has been delivered!, Enjoy your product!`,
				unread: true,
			};
			const [buyerNotificationRecord] = await Promise.all([
				DBNotification.create(notificationInput),
			]);
			const buyer = await User.findOne({ where: { id: buyerId } });
			const emailingData = {
				to: buyer?.email as string,
				subject: "Order Delivered",
				html: buyerNotificationRecord?.message,
			};
			await Promise.all([sendEmail(emailingData)]);

			emitNotification([buyerNotificationRecord]);
		},
	);

	myEmitter.on(
		EventName.ORDERS_CANCELED,
		async (order: OrderModelAttributes) => {
			const buyerId = order.buyerId;

			if (!order) {
				console.log("Order not found!");
				return;
			}

			const notificationInput = {
				userId: buyerId,
				message: `Your order has been canceled!`,
				unread: true,
			};
			const [buyerNotificationRecord] = await Promise.all([
				DBNotification.create(notificationInput),
			]);
			const buyer = await User.findOne({ where: { id: buyerId } });
			const emailingData = {
				to: buyer?.email as string,
				subject: "Order Canceled",
				html: buyerNotificationRecord?.message,
			};
			await Promise.all([sendEmail(emailingData)]);

			emitNotification([buyerNotificationRecord]);
		},
	);
};
