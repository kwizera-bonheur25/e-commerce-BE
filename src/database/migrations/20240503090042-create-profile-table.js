/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("profile", {
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
			email: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			birthDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			preferredLanguage: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			preferredCurrency: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			profileImage: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			addressLine1: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			addressLine2: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			country: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			city: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			zipCode: {
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

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("profile");
	},
};
