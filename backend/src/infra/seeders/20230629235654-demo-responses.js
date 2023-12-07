"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Responses",
      [
        {
          id: 777,
          author: "johndoe",
          content: "content of response comment",
          likes: 0,
          postId: 777,
          userId: 777,
          commentId: 777,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 888,
          author: "johndoe",
          content: "content of response comment",
          likes: 0,
          postId: 777,
          userId: 777,
          commentId: 777,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 999,
          author: "johndoe",
          content: "content of response comment",
          likes: 0,
          postId: 777,
          userId: 777,
          commentId: 888,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Responses", null, {});
  },
};
