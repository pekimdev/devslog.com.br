'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    

    static associate(models) {
      this.hasMany(models.Comments, { foreignKey: 'userId', as: 'comments' });
      this.hasMany(models.Posts, { foreignKey: 'userId', as: 'posts'});
      this.hasMany(models.Responses, { foreignKey: 'userId', as: 'responses' });
    }
  }
  Users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    authenticated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};