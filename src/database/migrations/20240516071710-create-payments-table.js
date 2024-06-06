/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("payments", {
			id: {
				type: Sequelize.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			payerId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			paymentMethod: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			paymentId: {
				type: Sequelize.STRING,
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

	async down(queryInterface, _Sequelize) {
		await queryInterface.dropTable("payments");
	},
};
