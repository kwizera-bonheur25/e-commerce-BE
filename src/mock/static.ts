import path from "path";
import { isAvailable } from "../utils/nodeEvents";

export const image_one_path: string = path.resolve(
	__dirname,
	"images/BMW1.jpeg",
);
export const image_two_path: string = path.resolve(
	__dirname,
	"images/BMW2.jpeg",
);
export const image_three_path: string = path.resolve(
	__dirname,
	"images/BMW3.webp",
);
export const image_four_path: string = path.resolve(
	__dirname,
	"images/BMW4.webp",
);

export const profile_image: string = path.resolve(
	__dirname,
	"images/abicar.png",
);

export const login_user = {
	email: "peter23456545@gmail.com",
	password: "passwordQWE123",
};
export const login_user_br = {
	email: "peter234565@gmail.com",
	passworr: "passwordQWE123",
};

export const login_user_wrong_credentials = {
	email: "john@example.com",
	password: "<PASSWORD>",
};

export const login_user_invalid_email = {
	email: "peter",
	password: "<Password@345>",
};

export const NewUser = {
	firstName: "peter",
	lastName: "paul",
	email: "peter23456545@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const NewUserPasswordExpired = {
	firstName: "peter",
	lastName: "paul",
	email: "paul@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const logInPasswordExpired = {
	email: "paul@gmail.com",
	password: "passwordQWE123",
};
export const updated_profile_data = {
	firstName: "Hannah",
	lastName: "Agahozo",
	profileImage: profile_image,
	gender: "Female",
	phoneNumber: "+250782332323",
	preferredLanguage: "Kinyarwanda",
	preferredCurrency: "RWF",
	addressLine1: "Kn 123 st",
	country: "Rwanda",
	city: "Kigali",
	birthDate: "1909-02-09",
	zipCode: 5432,
};
export const updated_profile_error = {
	firstName: "Hannah",
	lastName: "Agahozo",
	profileImage: profile_image,
	gender: "Female",
	phoneNumber: "0782332323",
	preferredLanguage: "Kinyarwanda",
	preferredCurrency: "RWF",
	addressLine1: "Kn 123 st",
	country: "Rwanda",
	city: "Kigali",
	birthDate: "1909-02-09",
	zipCode: "jshshs",
};

export const new_buyer_user = {
	firstName: "mark",
	lastName: "mark",
	email: "mark234565@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const new_seller_user = {
	userName: "peter",
	firstName: "peter",
	lastName: "paul",
	email: "peter234565@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const exist_user = {
	userName: "Tp",
	firstName: "travis",
	lastName: "paul",
	email: "travis@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
	role: "85013dc0-a77a-4a38-9a38-9ef493c87d9d",
};
export const user_bad_request = {
	firstName: "unknow",
	lastName: "paul",
	email: "unknown@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
	age: 12,
};

export const User_without_email = {
	firstName: "peter",
	lastName: "paul",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const two_factor_authentication_data = {
	otp: "204207",
};

export const bad_two_factor_authentication_data = {
	otp: "204208",
};

export const partial_two_factor_authentication_data = {
	otp: "20420",
};
export const google_profile = {
	email: "karimu@gmail.com",
	password: "karimu@gmail.com",
};
export const sameAsOldPassword = {
	password: "passwordQWE123",
};
export const requestResetBody = {
	email: "peter234565@gmail.com",
};
export const NotUserrequestBody = {
	email: "peter2345@gmail.com",
	forTesting: true,
};

export const newPasswordBody = {
	password: "New@password",
};

export const roleAdmin = {
	roleName: "ADMIN",
};

export const mockRole = {
	roleName: "UserRole",
};

export const mock_not_Role = {
	roleName: "NotRole",
};

export const mockRoleBuyer = {
	roleName: "BUYER",
};
export const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjMjUyYWY3LWJhYjYtNGY4MC05YzQ5LTIzZTQ0MWRmMDJjYiIsInJvbGUiOiJTRUxMRVIiLCJpYXQiOjE3MTM5Njg5MDgsImV4cCI6MTc0NTUyNjUwOH0.22hDHx9vHSPw_fQ_yfr-29mUme1LpqFQG-ZIsFjhlH4";

export const new_product = {
	name: "BMW",
	price: 49900,
	images: [image_one_path, image_two_path, image_three_path, image_four_path],
	discount: 100,
	quantity: 356,
	expiryDate: "2324-04-30T00:00:00.000Z",
};
export const expired_product = {
	name: "BMW",
	price: 49900,
	images: [image_one_path, image_two_path, image_three_path, image_four_path],
	discount: 100,
	quantity: 356,
	expiryDate: "2022-04-30T00:00:00.000Z",
};
export const new_update_product = {
	name: "Ferrari",
	price: 49900,
	discount: 100,
	quantity: 356,
	images: [image_one_path],
};
export const new_updated_status = {
	isAvailable,
};
export const sameAsOldStatus = {
	isAvailable,
};

export const new_category = {
	name: "Cars",
	description: "Cars are amazing!",
};

export const new_updated_category = {
	name: "Fancy Cars",
	description: "This cars are highly amazing!",
};

export const testMessage = "chat test message";
export const update_pass = {
	oldPassword: "passwordQWE123",
	newPassword: "newPassword123",
	confirmPassword: "newPassword123",
};
export const update_pass_empty = {
	oldPassword: "passwordQWE123",
	newPassword: "",
	confirmPassword: "",
};

export const update_with_wrong_old_pass = {
	oldPassword: "asswordQWE123",
	newPassword: "newPassword123",
	confirmPassword: "newPassword123",
};

export const new_pass_equals_old_pass = {
	oldPassword: "passwordQWE123",
	newPassword: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const new_pass_not_equals_confirm_pass = {
	oldPassword: "passwordQWE123",
	newPassword: "newPassword123",
	confirmPassword: "newPassword1234",
};
export const mock_users = [
	{
		id: "7121d946-7265-45a1-9ce3-3da1789e657e",
		...NewUser,
		userName: "e555bd6",
		role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
		isVerified: false,
		lastTimePasswordUpdated: new Date(Date.now()),
		isPasswordExpired: false,
		isActive: true,
	},
	{
		id: "7221d946-7265-45a1-9ce3-3da1789e657e",
		...new_buyer_user,
		userName: "e555bd6",
		role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
		isVerified: true,
		lastTimePasswordUpdated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
		isPasswordExpired: false,
		isActive: true,
	},
];
export const new_buyer_user_wishlist = {
	firstName: "danny",
	lastName: "mark",
	email: "mark234525@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const new_seller_user_wishlist = {
	userName: "james",
	firstName: "peter",
	lastName: "paul",
	email: "peter231565@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const new_wishlist = {
	productId: "9e555bd6-0f36-454a-a3d5-89edef4ff9d1",
};

export const invalid_wishlist = {
	productId: "9e555bd6-0f36-454a-a3d5-89edef4ff9d0",
};

export const invalid_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjMjUyYWY3LWJhYjYtNGY4MC05YzQ5LTIzZTQ0MWRmMDJjYiIsInJvbGUiOiJTRUxMRVIiLCJpYXQiOjE3MTM5Neg5MDgsImV4cCI6MTc0NTUyNjUwOH0.22hDHx9vHSPw_fQ_yfr-29mUme1LpqFQG-ZIsFjhlH4";
export const search_product = {
	name: "BMW",
	minPrice: 1,
	categoryName: "cars",
	maxPrice: 10000000,
};
export const search_product_Not_found = {
	name: "Productname",
	categoryName: "electronic",
	minPrice: 1,
	maxPrice: 900,
};

export const invalidTokens = {
	invalidtoke:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmZTFkYjllLWI5MDQtNGFhMS04MDgwLTU0YWE3MmIxYWZhYyIsInJvbGUiOiJTRUxMRVIiLCJvdHAiOiIwNDMyODQiLCJpYXQiOjE3MTUxNTgzNjgsImV4cCI6MTc0NjcxNTk2OH0.WJsyXFc2p9Gdi8GBJzaiURV6rYxieHebtOA90",
};
export const disable_user = {
	isAccountActive: "false",
	reason: "you disobeyed rules of our app",
};

export const enable_user = {
	isAccountActive: "true",
	reason: "you have obeyed our rules",
};

export const account_status_invalid = {
	isAccountActive: "",
	reason: "",
};
export const review = {
	productId: "",
	feedBack: "any feed back",
	retings: "2",
};

export const review_user = {
	userName: "james",
	firstName: "peter",
	lastName: "paul",
	email: "peterBuyer5@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const review_user_login = {
	email: "peterBuyer5@gmail.com",
	password: "passwordQWE123",
};
export const second_review_user = {
	userName: "james",
	firstName: "peter",
	lastName: "paul",
	email: "mosesBuyer5@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const second_review_user_login = {
	email: "mosesBuyer5@gmail.com",
	password: "passwordQWE123",
};
export const role_buyer_review = {
	roleName: "BUYER",
};

export const role_seller_review = {
	roleName: "ADMIN",
};

export const order_status = {
	status: "canceled",
	deliveryDate: "2024-06-18T11:14:50.065Z",
};

export const status_not_neither_canceler_delivered_nor_pending = {
	status: "ending",
	deliveryDate: "2024-06-18T11:14:50.065Z",
};

export const status_empty = {
	status: "",
	deliveryDate: "2024-06-18T11:14:50.065Z",
};

export const status_invalid_date = {
	status: "canceled",
	deliveryDate: "204-06-18T11:14:50.065Z",
};

export const status_past_date = {
	status: "canceled",
	deliveryDate: "2020-06-18T11:14:50.065Z",
};

export const momoPayWithSuccessNum = {
	phoneNumber: "0783520504",
};
export const momoPayWithFailedNum = {
	phoneNumber: "46733123450",
};

export const noAmountMomo = {
	phoneNumber: "0782570202",
};
export const noPhoneNumberMomo = {
	phoneNumber: "0782570202",
};
export const noExternalIdMomo = {
	phoneNumber: "0782570202",
};

export const momoPayWithRejectUSSD = {
	phoneNumber: "3",
};

export const momoPayAllowedNumber = [
	"46733123450",
	"46733123451",
	"46733123452",
	"46733123453",
	"46733123454",
];

export const momoPayInValidNumber = [
	"0771234567",
	"078123456",
	"07998765432",
	"46733123455",
	"1234567890",
];
