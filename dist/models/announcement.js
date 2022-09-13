'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
      Announcement.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'creator_id'
      });
      Announcement.belongsToMany(models.User, {
        as: 'participators',
        through: models.UserAnnouncement
      });
    }

  }

  Announcement.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    audio: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcements',
    timestamps: true
  });
  return Announcement;
};