'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Slip }) {
      // define association here
      this.hasMany(Slip, { foreignKey: 'tenantId' });
    }
  }
  Tenant.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      cnic: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fathersName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      domicile: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      guardianPhoneNumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      guardianEmail: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      residing: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      lastRentSlip: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      lastRentPaid: {
        allowNull: true,
        default: false,
        type: DataTypes.BOOLEAN,
      },
      slipsCount: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      tenantImageFile: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      cnicImageFile: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      guardianCnicImageFile: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      tenantImage: {
        allowNull: true,
        type: DataTypes.BLOB('long'),
      },
      cnicImage: {
        allowNull: true,
        type: DataTypes.BLOB('long'),
      },
      guardianCnicImage: {
        allowNull: true,
        type: DataTypes.BLOB('long'),
      },
      meta: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      formScanImageFile: {
        allowNull: false,
        type: DataTypes.STRING
      },
      formScanImage: {
        allowNull: true,
        type: DataTypes.BLOB('long'),
      },
    },
    {
      sequelize,
      modelName: 'Tenant',
      underscored: true,
      tableName: 'tenants',
      paranoid: true,
    },
  );

  return Tenant;
};
