"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.users, {
        as: "users",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  transaction.init(
    {
      account_number: DataTypes.INTEGER,
      transfer_proof: DataTypes.STRING,
      remaining_active: DataTypes.INTEGER,
      user_status: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
