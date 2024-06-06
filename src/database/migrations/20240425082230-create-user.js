/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("users", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userName: {
				type: Sequelize.STRING,
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
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			confirmPassword: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				references: {
					model: "roles",
					key: "id",
					onDelete: "CASCASE",
				},
			},
			isVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
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
		await queryInterface.dropTable("users");
	},
};
