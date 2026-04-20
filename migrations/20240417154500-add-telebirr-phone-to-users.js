'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'telebirr_phone', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'phone'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'telebirr_phone');
  }
};
