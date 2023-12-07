"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      this.hasMany(models.Comments, { foreignKey: "postId", as: "comments" });
      this.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
    }
  }
  Posts.init(
    {
      author: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Posts",
    },
  );
  return Posts;
};
