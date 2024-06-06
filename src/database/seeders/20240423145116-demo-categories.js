"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"categories",
			[
				{
					id: "8dfe453c-b779-453c-b96e-afe656eeebab",
					name: "Fruits",
					description: "Fruits are amazing",
					updatedAt: new Date(),
					createdAt: new Date(),
				},
				{
					id: "8efe453c-b779-453c-b96e-afe656eeebab",
					name: "Electronic",
					description: "Fruits are amazing",
					updatedAt: new Date(),
					createdAt: new Date(),
				},
				{
					id: "8ffe453c-b779-453c-b96e-afe656eeebab",
					name: "Furniture",
					description: "Fruits are amazing",
					updatedAt: new Date(),
					createdAt: new Date(),
				},
				{
					id: "7efe453c-b779-453c-b96e-afe656eeebab",
					name: "Medicine",
					description: "Fruits are amazing",
					updatedAt: new Date(),
					createdAt: new Date(),
				},
				{
					id: "a64aeab5-eaa1-48f4-9e52-8a0924a0490a",
					name: "Wigs",
					description: "Elegant wigs for Elegant ladies!",
					updatedAt: new Date(),
					createdAt: new Date(),
				},
			],
			{},
		);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("categories", null, {});
	},
};
