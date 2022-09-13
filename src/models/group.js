'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsToMany(models.User, {
        as: 'members',
        through: models.UserGroup,
      });
      Group.belongsTo(models.User, { as: 'owner', foreignKey: 'owner_id' });
    }
  }
  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emoji: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Group',
      tableName: 'group',
      timestamps: true,
    }
  );
  return Group;
};
