'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('smart_cards', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      cardId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'SUSPENDED'),
        defaultValue: 'ACTIVE'
      },
      telebirrPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      activatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lastUsedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('smart_cards');
  }
};
