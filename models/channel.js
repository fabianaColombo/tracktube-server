"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      channel.belongsTo(models.user);
    }
  }
  channel.init(
    {
      channelId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      created: DataTypes.DATE,
      url: DataTypes.STRING,
      description: DataTypes.TEXT,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "channel",
    }
  );
  return channel;
};
