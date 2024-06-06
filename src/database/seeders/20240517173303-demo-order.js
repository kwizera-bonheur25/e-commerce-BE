"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async up(queryInterface, Sequelize) {
		const users = await queryInterface.sequelize.query(
			"SELECT id FROM users LIMIT 3;",
			{ type: queryInterface.sequelize.QueryTypes.SELECT },
		);
		if (users.length < 2) {
			throw new Error(
				"Not enough data in orders, users, or products tables to seed sales data",
			);
		}
		await queryInterface.bulkInsert(
			"orders",
			[
				{
					id: "0ec3d632-a09e-42e5-abda-520fed82ef57",
					buyerId: users[0].id,
					status: "delivered",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "e918e9eb-4c12-417f-8e12-4ec6a0e5ae89",
					buyerId: users[1].id,
					status: "delivered",
					createdAt: "2023-04-07T17:06:40.859Z",
					updatedAt: "2023-04-07T17:06:40.859Z",
				},
			],
			{},
		);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("orders", null, {});
	},
};
