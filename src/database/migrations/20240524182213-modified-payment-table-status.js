// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = {
	up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("payments", "status", {
				type: Sequelize.STRING,
				defaultValue: "SUCCESSFUL",
				allowNull: false,
			}),

			queryInterface.addColumn("payments", "phoneNumber", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
		]);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("payments", "status"),
			queryInterface.removeColumn("payments", "phoneNumber"),
		]);
	},
};
