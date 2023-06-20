'use strict';
const { Model } = require('sequelize');

const Comments = require('./comments');

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    
    static associate(models) {
      Posts.hasMany(models.Comments, {
        foreignKey: 'postId'

      });
    }
  }
  Posts.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};