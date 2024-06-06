"use strict";

/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require("uuid");

module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async up(queryInterface, Sequelize) {
		const now = new Date();

		const orders = await queryInterface.sequelize.query(
			"SELECT id FROM orders LIMIT 2;",
			{ type: queryInterface.sequelize.QueryTypes.SELECT },
		);

		const users = await queryInterface.sequelize.query(
			"SELECT id FROM users LIMIT 2;",
			{ type: queryInterface.sequelize.QueryTypes.SELECT },
		);

		const products = await queryInterface.sequelize.query(
			"SELECT id FROM products LIMIT 2;",
			{ type: queryInterface.sequelize.QueryTypes.SELECT },
		);

		if (orders.length < 2 || users.length < 2 || products.length < 2) {
			throw new Error(
				"Not enough data in orders, users, or products tables to seed sales data",
			);
		}

		await queryInterface.bulkInsert(
			"sales",
			[
				{
					id: uuidv4(),
					orderId: orders[0].id,
					buyerId: users[0].id,
					productId: products[0].id,
					status: "delivered",
					deliveryDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
					quantitySold: 3,
					createdAt: now,
					updatedAt: now,
				},
				{
					id: uuidv4(),
					orderId: orders[1].id,
					buyerId: users[1].id,
					productId: products[1].id,
					status: "delivered",
					deliveryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
					quantitySold: 1,
					createdAt: now,
					updatedAt: now,
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		await queryInterface.bulkDelete(
			"sales",
			{
				status: {
					[Op.in]: ["pending", "canceled", "delivered"],
				},
			},
			{},
		);
	},
};
