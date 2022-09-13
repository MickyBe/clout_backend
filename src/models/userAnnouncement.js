'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAnnouncement extends Model {
    // static associate(models) {}
  }
  UserAnnouncement.init(
    {
      isSeen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserAnnouncement',
      tableName: 'user_announcement',
      timestamps: true,
    }
  );
  return UserAnnouncement;
};
