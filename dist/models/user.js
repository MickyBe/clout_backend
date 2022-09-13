'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.User, {
        as: 'friends',
        foreignKey: 'user_id',
        through: models.UserFriend,
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
      User.belongsToMany(models.User, {
        as: 'userFriends',
        foreignKey: 'friend_id',
        through: models.UserFriend,
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
      User.belongsToMany(models.Group, {
        as: 'groups',
        through: models.UserGroup
      });
      User.hasMany(models.Group, {
        as: 'ugroups',
        foreignKey: 'owner_id'
      });
      User.hasMany(models.Announcement, {
        as: 'uannouncements',
        foreignKey: 'creator_id'
      });
      User.belongsToMany(models.Announcement, {
        as: 'announcements',
        through: models.UserAnnouncement
      });
      User.hasMany(models.LocationHistory, {
        as: 'LocationHistory',
        foreignKey: 'user_id'
      });
      User.hasMany(models.savedTrips, {
        as: 'saved_trips',
        foreignKey: 'user_id'
      });
    }

  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};