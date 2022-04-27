'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable('tenants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cnic: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fathers_name:{
        allowNull: false,
        type: Sequelize.STRING
      },
      domicile:{
        allowNull: false,
        type: Sequelize.STRING
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      guardian_phone_number:{
        allowNull: false,
        type: Sequelize.STRING
      },
      email:{
        allowNull: false,
        type: Sequelize.STRING
      },
      guardian_email:{
        allowNull: false,
        type: Sequelize.STRING
      },
      residing: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      last_rent_slip: {
        allowNull: true,
        type: Sequelize.DATE
      },
      last_rent_paid: {
        allowNull: true,
        default: false,
        type: Sequelize.BOOLEAN
      },
      slips_count: {
        allowNull: false,
        default: 0,
        type: Sequelize.INTEGER
      },
      tenant_image: {
        allowNull: true,
        type: Sequelize.BLOB('long')
      },
      cnic_image: {
        allowNull: true,
        type: Sequelize.BLOB('long')
      },
      guardian_cnic_image: {
        allowNull: true,
        type: Sequelize.BLOB('long')
      },
      meta: {
        allowNull: false,
        type: Sequelize.STRING
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
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("tenants")
  }
};
