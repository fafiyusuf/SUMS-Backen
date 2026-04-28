'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: '$2b$10$Qa5WD9XF6sRxELRpxIPyVu7Pu3JIKKKuREICK2lFQfWi1M1YWzk5u', // password: admin123
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        fullName: 'John Driver',
        email: 'driver@example.com',
        password: '$2b$10$Qa5WD9XF6sRxELRpxIPyVu7Pu3JIKKKuREICK2lFQfWi1M1YWzk5u',
        role: 'driver',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        fullName: 'Jane Passenger',
        email: 'passenger@example.com',
        password: '$2b$10$Qa5WD9XF6sRxELRpxIPyVu7Pu3JIKKKuREICK2lFQfWi1M1YWzk5u',
        role: 'passenger',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
