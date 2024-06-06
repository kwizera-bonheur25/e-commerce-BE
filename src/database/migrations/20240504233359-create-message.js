"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("messages", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			senderId: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			message: {
				allowNull: false,
				type: Sequelize.STRING,
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
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("messages");
	},
};
