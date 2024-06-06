"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("products", {
			id: {
				type: Sequelize.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			price: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
			images: {
				type: Sequelize.ARRAY(Sequelize.STRING),
				allowNull: false,
			},
			discount: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			sellerId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
					onDelete: "CASCADE",
				},
			},
			categoryId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "categories",
					key: "id",
					onDelete: "CASCADE",
				},
			},
			expiryDate: {
				type: Sequelize.DATE,
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("products");
	},
};
