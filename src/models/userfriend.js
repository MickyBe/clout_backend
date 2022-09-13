'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserFriend extends Model {
    // static associate(models) {}
  }
  UserFriend.init(
    {
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      friend_id: { type: DataTypes.BIGINT, allowNull: false },
      isAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      userVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      friendVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'user_friend',
      modelName: 'UserFriend',
    }
  );
  return UserFriend;
};
