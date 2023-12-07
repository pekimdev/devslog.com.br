"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Responses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Comments, {
        foreignKey: "commentId",
        as: "comment",
      });
      this.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
    }
  }
  Responses.init(
    {
      author: DataTypes.STRING,
      content: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Responses",
    },
  );
  return Responses;
};
