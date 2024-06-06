"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"orders",
			[
				{
					id: "7391d946-7265-45a1-9ce3-3da1789e657e",
					buyerId: "5ea39bd8-ad6c-42a7-a136-32357cbede3a",
					status: "pending",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "7321d946-7260-45a1-9ce3-3da1789e657e",
					buyerId: "1001d946-8065-45a1-9ce3-3da1789e100a",
					status: "pending",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "7321d956-7260-45a1-9ce3-3da1789e657e",
					buyerId: "1001d946-7265-45a1-9ce3-3da1789e100a",
					status: "pending",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "7321d696-1000-45a1-9ce3-3da1789e657e", //testing
					buyerId: "1710fb6c-d56f-4e3b-bbbb-361c6cfd7ba3",
					status: "pending",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("orders", null, {});
	},
};
