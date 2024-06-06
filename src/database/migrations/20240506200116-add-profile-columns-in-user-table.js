/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.addColumn(
				"users",
				"gender",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"birthDate",
				{
					type: Sequelize.DATE,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"phoneNumber",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"preferredLanguage",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"preferredCurrency",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"profileImage",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"addressLine1",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"addressLine2",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"country",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"city",
				{
					type: Sequelize.STRING,
				},
				{ transaction },
			);
			await queryInterface.addColumn(
				"users",
				"zipCode",
				{
					type: Sequelize.INTEGER,
				},
				{ transaction },
			);
			await transaction.commit();
			return Promise.resolve();
		} catch (err) {
			if (transaction) {
				await transaction.rollback();
			}
			return Promise.reject(err);
		}
	},

	down: async (queryInterface, Sequelize) => {
		let transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.removeColumn("users", "gender", { transaction });
			await queryInterface.removeColumn("users", "birthDate", { transaction });
			await queryInterface.removeColumn("users", "phoneNumber", {
				transaction,
			});
			await queryInterface.removeColumn("users", "preferredLanguage", {
				transaction,
			});
			await queryInterface.removeColumn("users", "preferredCurrency", {
				transaction,
			});
			await queryInterface.removeColumn("users", "profileImage", {
				transaction,
			});
			await queryInterface.removeColumn("users", "addressLine1", {
				transaction,
			});
			await queryInterface.removeColumn("users", "addressLine2", {
				transaction,
			});
			await queryInterface.removeColumn("users", "country", { transaction });
			await queryInterface.removeColumn("users", "city", { transaction });
			await queryInterface.removeColumn("users", "zipCode", { transaction });
			await transaction.commit();
			return Promise.resolve();
		} catch (err) {
			if (transaction) {
				await transaction.rollback();
			}
			return Promise.reject(err);
		}
	},
};
