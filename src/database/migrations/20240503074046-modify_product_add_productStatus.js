"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("products", "isAvailable", {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			}),
		]);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("products", "isAvailable"),
		]);
	},
};
