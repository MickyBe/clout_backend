'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class savedTrips extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      savedTrips.belongsToMany(models.LocationHistory, {
        as: 'locations',
        through: 'saved_location'
      });
      savedTrips.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      });
    }

  }

  savedTrips.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'savedTrips',
    tableName: 'saved_trips',
    timestamps: true
  });
  return savedTrips;
};