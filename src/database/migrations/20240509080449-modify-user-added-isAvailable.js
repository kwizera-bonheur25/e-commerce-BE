module.exports = {
	up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("users", "isActive", {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			}),
		]);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	down(queryInterface, Sequelize) {
		return Promise.all([queryInterface.removeColumn("users", "isActive")]);
	},
};
