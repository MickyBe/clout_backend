'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    // static associate(models) {}
  }
  UserGroup.init(
    {
      isAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      userVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'UserGroup',
      tableName: 'user_group',
      timestamps: true,
    }
  );
  return UserGroup;
};
