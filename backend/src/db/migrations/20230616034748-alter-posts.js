'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('posts', 'column', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
      ]);
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('posts', 'id', { transaction: t }),
      ]);
    });
  }
  };