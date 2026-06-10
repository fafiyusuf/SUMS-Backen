'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('route_path_coordinates', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            route_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'routes',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            sequence: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: false
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // Add index for faster route lookups
        await queryInterface.addIndex('route_path_coordinates', ['route_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('route_path_coordinates');
    }
};
