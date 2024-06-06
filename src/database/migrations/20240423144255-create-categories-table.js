"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("categories", {
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
			description: {
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("categories");
	},
};
