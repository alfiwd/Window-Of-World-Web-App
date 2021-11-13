"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class book_lists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      book_lists.belongsTo(models.users, {
        as: "user",
        foreignKey: {
          name: "user_id",
        },
      });
      book_lists.belongsTo(models.books, {
        as: "book",
        foreignKey: {
          name: "book_id",
        },
      });
    }
  }
  book_lists.init(
    {
      user_id: DataTypes.INTEGER,
      book_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "book_lists",
    }
  );
  return book_lists;
};
