'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VerificationTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VerificationTokens.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_redeemed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      client_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'VerificationTokens',
      underscored: true,
      tableName: 'verification_tokens',
    },
  );
  return VerificationTokens;
};
