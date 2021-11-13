"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      books.hasMany(models.book_lists, {
        as: "book_lists",
        foreignKey: {
          name: "book_id",
        },
      });
    }
  }
  books.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      publication_date: DataTypes.DATE,
      pages: DataTypes.INTEGER,
      isbn: DataTypes.INTEGER,
      about: DataTypes.TEXT,
      book_file: DataTypes.STRING,
      image_file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "books",
    }
  );
  return books;
};
