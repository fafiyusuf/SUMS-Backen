'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add is_simulation to trips table
        await queryInterface.addColumn('trips', 'is_simulation', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });

        // Add route_type to routes table
        await queryInterface.addColumn('routes', 'route_type', {
            type: Sequelize.ENUM('operational', 'simulation', 'test'),
            defaultValue: 'operational',
            allowNull: false
        });

        // Add simulation_enabled to routes table
        await queryInterface.addColumn('routes', 'simulation_enabled', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('trips', 'is_simulation');
        await queryInterface.removeColumn('routes', 'route_type');
        await queryInterface.removeColumn('routes', 'simulation_enabled');
        // Note: Removing ENUM types in Postgres can be tricky if they are still shared,
        // but here we just leave it or drop the type if needed.
    }
};
