/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"profile",
			[
				{
					id: "8821d946-7265-45a1-9ce3-3da1789e634f",
					userId: "1001d946-7265-45a1-9ce3-3da1789e100a",
					email: "aphro@gmail.com",
					firstName: "Aphrodis",
					lastName: "Uwineza",
					birthDate: new Date(),
					preferredLanguage: "Kinyarwanda",
					preferredCurrency: "RWF",
					profileImage:
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					addressLine1: "Kn 136 st",
					addressLine2: " ",
					country: "Rwanda",
					city: "Rubavu",
					zipCode: 20043,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("profile", null, {});
	},
};
