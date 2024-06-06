const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(password, salt);
	return hashedPass;
};
("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"users",
			[
				{
					id: "7121d946-7265-45a1-9ce3-3da1789e657e",
					firstName: "prince",
					lastName: "hatungi",
					userName: "hat",
					email: "princeBuyer@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1001d946-7265-45a1-9ce3-3da1789e100a",
					firstName: "aline",
					lastName: "uwimana",
					userName: "aline",
					email: "alineAdmin@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1001d946-8065-45a1-9ce3-3da1789e100a",
					firstName: "tito",
					lastName: "tuyisenge",
					userName: "tite",
					email: "tuyisengeseller@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "7321d946-7265-45a1-9ce3-3da1789e657e",
					firstName: "Aphrodis",
					lastName: "Uwineza",
					userName: "aphro",
					email: "aphro@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: false,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "5ea39bd8-ad6c-42a7-a136-32357cbede3a",
					firstName: "Elyna",
					lastName: "Sage",
					userName: "Jacky",
					email: "jackytuyisenge53@gmail.com",
					password:
						"$2b$10$Nvux5MaZkOKT.W0jvDT/8.p3kEOzjqXKsGsR1uEoIntr.to2tas0S",
					confirmPassword:
						"$2b$10$Nvux5MaZkOKT.W0jvDT/8.p3kEOzjqXKsGsR1uEoIntr.to2tas0S",
					role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1710fb6c-d56f-4e3b-bbbb-361c6cfd7ba3",
					firstName: "na",
					lastName: "dy",
					userName: "nady",
					email: "tuyisengejacqui2002@gmail.com",
					password:
						"$2b$10$aTpLk6st1piTjRtDA5PbT.gOfuoMuydUxCiMdqU4PUYj20aEENcey",
					confirmPassword:
						"$2b$10$aTpLk6st1piTjRtDA5PbT.gOfuoMuydUxCiMdqU4PUYj20aEENcey",
					role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("users", null, {});
	},
};
