'use strict';
const { Model, DATE } = require('sequelize');
const {SLIP_TYPES} = require('../constants/slip');
const {MONTHS} = require('../constants/months');

module.exports = (sequelize, DataTypes) => {
  class Slip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Tenant}) {
      // define association here
      this.belongsTo(Tenant, {foreignKey: 'tenantId'});
    }
  }
  Slip.init(
    {
      tenantId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      slipType: {
        allowNull: false,
        type: DataTypes.ENUM(SLIP_TYPES.RENT, SLIP_TYPES.ARREARS, SLIP_TYPES.DEPOSIT, SLIP_TYPES.OTHERS)
      },
      rentOfMonth: {
        allowNull: false,
        type: DataTypes.ENUM(
          MONTHS.JANUARY,
          MONTHS.FEBRUARY,
          MONTHS.MARCH,
          MONTHS.APRIL,
          MONTHS.MAY,
          MONTHS.JUNE,
          MONTHS.JULY,
          MONTHS.AUGUST,
          MONTHS.SEPTEMBER,
          MONTHS.OCTOBER,
          MONTHS.NOVEMBER,
          MONTHS.DECEMBER,
        )
      },
      amount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      arrearsOrPenaltiesPaid: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      meta: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: "{building:'', floor: '', room: '', recievedFrom: '', occupation:''}",
      },
      paymentStatus: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      sequelize,
      modelName: 'Slip',
      underscored: true,
      tableName: 'slips',
      paranoid: true,
    }
  )
  return Slip;
}