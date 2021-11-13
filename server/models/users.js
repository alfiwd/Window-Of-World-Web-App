"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.transaction, {
        as: "transactions",
        foreignKey: {
          name: "user_id",
        },
      });
      users.hasMany(models.book_lists, {
        as: "book_lists",
        foreignKey: {
          name: "user_id",
        },
      });
      users.hasMany(models.chats, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender",
        },
      });
      users.hasMany(models.chats, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient",
        },
      });
    }
  }
  users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
      subscribe_status: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      photo_profile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
