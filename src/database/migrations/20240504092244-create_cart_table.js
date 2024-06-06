"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("carts", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			products: {
				type: Sequelize.ARRAY(Sequelize.JSONB),
			},
			total: {
				type: Sequelize.FLOAT,
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

		await queryInterface.addConstraint("carts", {
			fields: ["userId"],
			type: "foreign key",
			name: "fk_cart_user",
			references: {
				table: "users",
				field: "id",
			},
			onDelete: "CASCADE",
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable("carts");
	},
};
