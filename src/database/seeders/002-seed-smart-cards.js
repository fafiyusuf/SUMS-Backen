'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('smart_cards', [
      {
        id: '150e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440002', // Jane Passenger
        card_id: 'RFID-123456789',
        status: 'ACTIVE',
        telebirr_phone: '+251912345678',
        activated_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('smart_cards', null, {});
  }
};
