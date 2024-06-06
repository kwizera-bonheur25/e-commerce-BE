"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("wishes", {
			id: {
				type: Sequelize.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
					onDelete: "CASCADE",
				},
			},
			productId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "products",
					key: "id",
					onDelete: "CASCADE",
				},
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("wishes");
	},
};
