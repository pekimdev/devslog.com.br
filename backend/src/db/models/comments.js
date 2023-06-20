'use strict';
const { Model } = require('sequelize');
const Users = require('./Users');
const Posts = require('./Posts');


module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
  
    static associate(models) {
      Comments.belongsTo(models.Users, {
        foreignKey: 'userId'
      });

      Comments.belongsTo(models.Posts, {
        foreignKey: 'postId'
      });
    }}

  Comments.init({
    content: DataTypes.STRING,
    likes: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};