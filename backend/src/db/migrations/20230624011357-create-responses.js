'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('responses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.INTEGER
      },
      postId: {
        type: Sequelize.STRING,
        references: { model: 'posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.STRING,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      commentId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('responses');
  }
};