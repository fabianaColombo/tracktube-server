"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class subscriberCountPerDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  subscriberCountPerDay.init(
    {
      channelId: DataTypes.STRING,
      count: DataTypes.INTEGER,
      day: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "subscriberCountPerDay",
    }
  );
  return subscriberCountPerDay;
};
