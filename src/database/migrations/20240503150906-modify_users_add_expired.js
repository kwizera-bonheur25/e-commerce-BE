const currentDate = new Date(Date.now());
const passExpirationTime = new Date(currentDate);
passExpirationTime.setMonth(passExpirationTime.getMonth() + 4);

module.exports = {
	up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("users", "isPasswordExpired", {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			}),
			queryInterface.addColumn("users", "lastTimePasswordUpdated", {
				type: Sequelize.DATE,
				defaultValue: currentDate,
				allowNull: false,
			}),
		]);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("users", "isPasswordExpired"),
			queryInterface.removeColumn("users", "lastTimePasswordUpdated"),
		]);
	},
};
