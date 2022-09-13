'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LocationHistory.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
      });
      LocationHistory.belongsToMany(models.savedTrips, {
        as: 'saved',
        through: 'saved_location',
      });
      // define association here
    }
  }
  LocationHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'LocationHistory',
      tableName: 'location_history',
      timestamps: true,
    }
  );
  return LocationHistory;
};
