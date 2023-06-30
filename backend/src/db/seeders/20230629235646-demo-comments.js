'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Comments', [{
     id: 777,
     author: 'johndoe',
     content: 'content of comment',
     likes: 0,
     userId: 777,
     postId: 777,
     createdAt: new Date(),
     updatedAt: new Date(),
     },
     {
      id: 888,
      author: 'johndoe',
      content: 'content of comment',
      likes: 0,
      userId: 777,
      postId: 777,
      createdAt: new Date(),
      updatedAt: new Date(),
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Comments', null, {});
  }
};
