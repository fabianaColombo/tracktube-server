"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("channels", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      youtubeId: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      created: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      country: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("channels");
  },
};
