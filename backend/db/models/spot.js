'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'SpotImages',
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lat: {
        type: DataTypes.FLOAT, // changed to float to allow for decimal places
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      lng: {
        type: DataTypes.FLOAT, // changed to float to allow for decimal places
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.FLOAT, // changed to float to allow for decimal places
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      // avgRating: {
      //   type: DataTypes.FLOAT, // changed to float to allow for decimal places
      //   allowNull: false,
      //   validate: {
      //     isDecimal: true,
      //     min: 0,
      //     max: 5,
      //   },
        
        // set(val) {
        //   // Round the average rating to 1 decimal place
        //   const roundedRating = Math.min(5, Math.max(0, parseFloat(val).toFixed(1)));
        //   this.setDataValue('avgRating', roundedRating);
        // },
      },
    // },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};