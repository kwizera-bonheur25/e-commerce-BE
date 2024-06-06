"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"sales",
			[
				{
					id: "1781d946-7265-45a1-9ce3-3da1789e100a",
					orderId: "7321d956-7260-45a1-9ce3-3da1789e657e",
					buyerId: "7121d946-7265-45a1-9ce3-3da1789e657e",
					productId: "9e555bd6-0f36-454a-a3d5-89edef4ff9d1",
					status: "pending",
					deliveryDate: new Date(),
					quantitySold: 10,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1781d946-7265-45a1-9ce3-4da1789e100a",
					orderId: "7391d946-7265-45a1-9ce3-3da1789e657e",
					buyerId: "5ea39bd8-ad6c-42a7-a136-32357cbede3a",
					productId: "9e555bd6-0f36-454a-a3d5-89edef4ff9d2",
					status: "pending",
					deliveryDate: new Date(),
					quantitySold: 8,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1781d946-7265-45a1-9ce3-3da1789e700a",
					orderId: "7321d946-7260-45a1-9ce3-3da1789e657e",
					buyerId: "1001d946-7265-45a1-9ce3-3da1789e100a",
					productId: "9e555bd6-0f36-454a-a3d5-89edef4ff9d4",
					status: "delivered",
					deliveryDate: new Date(),
					quantitySold: 20,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1781d946-1075-45a1-9ce3-3da1789e700a", //test
					orderId: "7321d696-1000-45a1-9ce3-3da1789e657e",
					buyerId: "1710fb6c-d56f-4e3b-bbbb-361c6cfd7ba3",
					productId: "6f15bcc9-033b-4304-9486-09598705a44f",
					status: "delivered",
					deliveryDate: new Date(),
					quantitySold: 20,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1781d946-1085-45a1-9ce3-3da1789e700a", //test
					orderId: "7321d696-1000-45a1-9ce3-3da1789e657e",
					buyerId: "1710fb6c-d56f-4e3b-bbbb-361c6cfd7ba3",
					productId: "e6b5aa43-9c74-478a-8a49-09146821d014",
					status: "delivered",
					deliveryDate: new Date(),
					quantitySold: 20,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("sales", null, {});
	},
};
