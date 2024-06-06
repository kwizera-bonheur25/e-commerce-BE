import { Optional } from "sequelize";
import { cartItem } from "./cart";

/**
 * -------------- User Model ---------------------
 */

export interface UserModelAttributes {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
	isVerified: boolean;
	isPasswordExpired?: boolean;
	lastTimePasswordUpdated?: Date;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	gender?: string;
	birthDate?: Date;
	phoneNumber?: string;
	preferredLanguage?: string;
	preferredCurrency?: string;
	profileImage?: string;
	addressLine1?: string;
	addressLine2?: string;
	country?: string;
	city?: string;
	zipCode?: number;
}

export interface UserModelInclude extends UserModelAttributes {
	Roles: any;
}

export type UserCreationAttributes = Optional<
	UserModelAttributes,
	"id" | "createdAt" | "updatedAt"
> & {
	role?: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
	birthDate?: Date;
	phoneNumber?: string;
	preferredLanguage?: string;
	preferredCurrency?: string;
	profileImage?: string;
	addressLine1?: string;
	addressLine2?: string;
	country?: string;
	city?: string;
	zipCode?: number;
};

/**
 * -------------- Order Model ---------------------
 */
export interface OrderModelAttributes {
	id: string;
	buyerId: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
}
export type OrderCreationAttributes = Optional<
	OrderModelAttributes,
	"id" | "createdAt" | "updatedAt"
> & {
	status?: string;
	buyerId?: string;
};

export type OrderWithUserAssociations = OrderModelAttributes & {
	User?: UserCreationAttributes;
};

/**
 * -------------- sales Model ---------------------
 */
export interface salesModelAttributes {
	id: string;
	orderId: string;
	buyerId: string;
	productId: string;
	status: string;
	deliveryDate: Date;
	quantitySold: number;
	createdAt?: Date;
	updatedAt?: Date;
}
export type salesCreationAttributes = Optional<
	salesModelAttributes,
	"id" | "createdAt" | "updatedAt"
> & {
	status?: string;
	orderId?: string;
	buyerId?: string;
	productId?: string;
	deliveryDate?: Date;
	quantitySold?: number;
};

/**
 * -------------- Token Model ---------------------
 */

export interface TokenModelAttributes {
	id: string;
	token: string;
}

export type TokenCreationAttributes = Optional<TokenModelAttributes, "id">;

/**
 * -------------- Product Model ---------------------
 */

export interface ProductAttributes {
	id: string;
	name: string;
	price: number;
	images: string[];
	discount: number;
	quantity: number;
	sellerId: string;
	categoryId: string;
	expiryDate: Date;
	isAvailable?: boolean;
	isExpired?: boolean;
	isSold?: boolean;
}

export type ProductCreationAttributes = Omit<ProductAttributes, "id">;

export type ProductWithAssociations = ProductAttributes & {
	seller?: UserCreationAttributes;
};

/**
 * -------------- Category Model ---------------------
 */

export interface CategoryAttributes {
	id: string;
	name: string;
	description: string;
}

export type CategoryCreationAttributes = Omit<CategoryAttributes, "id">;

/**
 * ----------------- Blacklist model ----------------------------
 */
export interface BlacklistModelAtributes {
	id?: string;
	token: string;
}

/**
 * ----------------- reset model ----------------------------
 */

export interface resetPasswordModelAtributes {
	id?: string;
	email: string;
	resetToken: string;
}
/**
 * ----------------- role model ----------------------------
 */

export interface roleModelAttributes {
	id: string;
	roleName: string;
}
export type roleCreationAttributes = Optional<roleModelAttributes, "id">;

/**
 * ----------------- role model ----------------------------
 */

export interface messageModelAttributes {
	id: string;
	senderId: string;
	message: string;
}
/**
 * -------------- Wishes Model ---------------------
 */
export interface WishesAttributes {
	id: string;
	userId: string;
	productId: string;
	product?: ProductAttributes;
}
export interface WishesCreationAttributes
	extends Omit<WishesAttributes, "id"> {}
// ---------------------------- cart --------------------------------

export interface cartModelAttributes {
	id: string;
	userId: string;
	products: Array<cartItem>;
	total: number;
}
export type cartCreationAttributes = Optional<cartModelAttributes, "id">;

/**
 * ---------------- payments -----------------------
 */

export interface PaymentsModelAttributes {
	id: string;
	payerId: string;
	paymentMethod: string;
	paymentId: string;
	status: string;
	phoneNumber: string;
}

export type paymentsCreationAttributes = Optional<
	PaymentsModelAttributes,
	"id" | "status" | "phoneNumber"
>;
/**
 * -------------- Review Model ---------------------
 */
export interface reviewsAttribute {
	id: string;
	userId: string;
	productId: string;
	feedBack: string;
	ratings: number;
}

export interface reviewCreationAttributes
	extends Omit<reviewsAttribute, "id"> {}

/**
 * ------------------------------Notification model---------------------------------
 */

export interface NotificationAttributes {
	id?: string;
	message: string;
	unread: boolean;
	userId: string;
}
// Notification.ts

export interface NotificationEmition {
	userId: string;
	message: string;
}
// **
//  * -------------- Order Model ---------------------
//  */
export interface OrderModelAttributes {
	id: string;
	buyerId: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * -------------- sales Model ---------------------
 */
export interface salesModelAttributes {
	id: string;
	orderId: string;
	buyerId: string;
	productId: string;
	status: string;
	deliveryDate: Date;
	quantitySold: number;
	createdAt?: Date;
	updatedAt?: Date;
}
