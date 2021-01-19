"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class favoriteChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      favoriteChannel.belongsTo(models.channel);
      favoriteChannel.belongsTo(models.user);
    }
  }
  favoriteChannel.init(
    {
      channelId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "favoriteChannel",
    }
  );
  return favoriteChannel;
};
