"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"roles",
			[
				{
					id: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					roleName: "BUYER",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					roleName: "ADMIN",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					roleName: "SELLER",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("roles", null, {});
	},
};
