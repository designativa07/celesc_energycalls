'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Counterparts', 'accessCode', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Código de acesso para login da contraparte'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Counterparts', 'accessCode');
  }
}; 