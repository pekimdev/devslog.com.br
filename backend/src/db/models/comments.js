'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
  
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(models.Posts, { foreignKey: 'postId', as: 'post' });
      this.hasMany(models.Responses, { foreignKey: 'commentId', as: 'responses' });
    }}

  Comments.init({
    author: DataTypes.STRING,
    content: DataTypes.STRING,
    likes: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};