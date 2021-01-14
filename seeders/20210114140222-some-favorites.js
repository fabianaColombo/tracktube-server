"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "favoriteChannels",
      [
        {
          channelId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 3,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 4,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 5,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 6,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 7,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 2,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("favoriteChannels", null, {});
  },
};
