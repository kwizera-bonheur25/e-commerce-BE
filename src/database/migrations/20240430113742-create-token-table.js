"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("tokens", {
			id: {
				type: Sequelize.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			token: {
				type: Sequelize.STRING(1000),
				allowNull: false,
				unique: true,
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
		await queryInterface.dropTable("tokens");
	},
};
