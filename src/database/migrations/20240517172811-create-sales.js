"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("sales", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			orderId: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				references: {
					model: "orders",
					key: "id",
				},
			},
			buyerId: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			productId: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				references: {
					model: "products",
					key: "id",
				},
			},
			status: {
				type: Sequelize.ENUM("pending", "canceled", "delivered"),
				defaultValue: "pending",
				allowNull: false,
			},
			deliveryDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			quantitySold: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable("sales");
	},
};
