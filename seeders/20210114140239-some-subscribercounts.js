"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "subscriberCountPerDays",
      [
        {
          channelId: 1,
          count: 234567,
          day: "2021-01-02",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 2,
          count: 23,
          day: "2021-01-02",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 3,
          count: 234,
          day: "2021-01-02",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          count: 2345678,
          day: "2021-01-05",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 2,
          count: 234,
          day: "2021-01-05",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 3,
          count: 2345,
          day: "2021-01-05",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 4,
          count: 5678,
          day: "2021-01-10",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 5,
          count: 4333,
          day: "2021-01-10",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 6,
          count: 450,
          day: "2021-01-10",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 7,
          count: 7,
          day: "2021-01-13",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          count: 2345676,
          day: "2021-01-13",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 2,
          count: 235,
          day: "2021-01-13",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("subscriberCountPerDays", null, {});
  },
};
