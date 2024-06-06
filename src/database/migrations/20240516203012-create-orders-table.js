"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("orders", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			buyerId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			status: {
				type: Sequelize.ENUM("pending", "canceled", "delivered"),
				defaultValue: "pending",
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("orders");
	},
};
