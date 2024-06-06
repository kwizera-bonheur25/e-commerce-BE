"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
	up: async (queryInterface) => {
		// Seed data for Messages table
		await queryInterface.bulkInsert(
			"messages",
			[
				{
					id: uuidv4(),
					senderId: "7121d946-7265-45a1-9ce3-3da1789e657e",
					message: "Sample message 1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					senderId: "7221d946-7265-45a1-9ce3-3da1789e657e",
					message: "Sample message 2",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("messages", null, {});
	},
};
