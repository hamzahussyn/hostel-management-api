'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    Promise.all([queryInterface.addColumn('tenants', 'form_scan_image_file', {allowNull: true,type: Sequelize.STRING}), queryInterface.addColumn('tenants','form_scan_image', {allowNull: true,type: Sequelize.BLOB('long')})])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    Promise.all([queryInterface.removeColumn('tenants','form_scan_image_file'), queryInterface.removeColumn('tenants','form_scan_image')])
  }
};
