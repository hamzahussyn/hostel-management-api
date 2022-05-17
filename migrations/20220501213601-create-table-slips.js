'use strict';

const { MONTHS } = require('../constants/months');
const { SLIP_TYPES } = require('../constants/slip');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('slips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tenant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      slip_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rent_of_month: {
        allowNull: false,
        type: Sequelize.ENUM(
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
        ),
      },
      amount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      arrears_or_penalties_paid: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      meta: {
        allowNull: true,
        type: Sequelize.STRING,
        default: "{building:'', floor: '', room: '', recievedFrom: '', occupation:''}",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('slips');
  },
};
