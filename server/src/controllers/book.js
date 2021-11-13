// Import model
const { books } = require("../../models");

// Import package
const Joi = require("joi");
const fs = require("fs");

// Books
exports.books = async (req, res) => {
  try {
    // Select all data users from database
    let data = await books.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Checking if data null
    if (data.length === 0) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Parse to json and map data item
    data = JSON.parse(JSON.stringify(data));
    data = data.map((item) => {
      return {
        ...item,
        book_file: process.env.FILE_PATH + item.book_file,
        image_file: process.env.FILE_PATH + item.image_file,
      };
    });

    // Send response to client
    res.send({
      status: "success",
      data: {
        books: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Book
exports.book = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Select data from database by id
    let data = await books.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Checking if data null
    if (data === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Add path to book file
    data = {
      ...data.dataValues,
      book_file: process.env.FILE_PATH + data.book_file,
      image_file: process.env.FILE_PATH + data.image_file,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        book: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Add book
exports.addBook = async (req, res) => {
  try {
    // Validate data from input json
    const dataBody = req.body;
    const schema = Joi.object({
      title: Joi.string().required(),
      publication_date: Joi.date().required(),
      pages: Joi.number().required(),
      author: Joi.string().required(),
      isbn: Joi.number().required(),
      about: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error && !req.files) {
      fs.unlinkSync("uploads/" + req.files.book_file[0].filename);
      fs.unlinkSync("uploads/" + req.files.image_file[0].filename);
      return res.send({
        status: "failed",
        message: "Please insert all data!",
      });
    }
    if (error) {
      if (req.files.image_file) {
        fs.unlinkSync("uploads/" + req.files.image_file[0].filename);
      } else if (req.files.book_file) {
        fs.unlinkSync("uploads/" + req.files.book_file[0].filename);
      } else if (!req.files) {
        fs.unlinkSync("uploads/" + req.files.image_file[0].filename);
        fs.unlinkSync("uploads/" + req.files.book_file[0].filename);
      }
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }
    if (!req.files.book_file && !req.files.image_file) {
      return res.send({
        status: "failed",
        message: "Please insert file to upload!",
      });
    }
    if (!req.files.book_file) {
      fs.unlinkSync("uploads/" + req.files.image_file[0].filename);
      return res.send({
        status: "failed",
        message: "Please insert book file to upload!",
      });
    }
    if (!req.files.image_file) {
      fs.unlinkSync("uploads/" + req.files.book_file[0].filename);
      return res.send({
        status: "failed",
        message: "Please insert image file to upload!",
      });
    }

    // Insert all data to database
    const addBook = await books.create({
      ...dataBody,
      book_file: req.files.book_file[0].filename,
      image_file: req.files.image_file[0].filename,
    });

    // Select data from database by id
    let data = await books.findOne({
      where: {
        id: addBook.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Parse to json and add path to book file
    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      book_file: process.env.FILE_PATH + data.book_file,
      image_file: process.env.FILE_PATH + data.image_file,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        book: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Edit book
exports.editBook = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Get data from body
    const dataBody = req.body;

    // Update data from databse checking by id
    const checkId = await books.findOne({
      where: {
        id,
      },
    });

    if (checkId === null) {
      return res.send({
        status: "failed",
        message: `Book id ${id} not found!`,
      });
    }

    // Checking if req files empty
    if (Object.keys(req.files).length === 0) {
      await books.update(
        { ...dataBody },
        {
          where: {
            id,
          },
        }
      );
    } else if (req.files.book_file !== undefined && req.files.image_file === undefined) {
      const book = await books.findOne({
        where: {
          id,
        },
      });
      fs.unlinkSync("uploads/" + book.book_file);
      await books.update(
        { ...dataBody, book_file: req.files.book_file[0].filename },
        {
          where: {
            id,
          },
        }
      );
    } else if (req.files.image_file !== undefined && req.files.book_file === undefined) {
      const book = await books.findOne({
        where: {
          id,
        },
      });
      fs.unlinkSync("uploads/" + book.image_file);
      await books.update(
        { ...dataBody, image_file: req.files.image_file[0].filename },
        {
          where: {
            id,
          },
        }
      );
    } else {
      const book = await books.findOne({
        where: {
          id,
        },
      });
      fs.unlinkSync("uploads/" + book.book_file);
      fs.unlinkSync("uploads/" + book.image_file);
      await books.update(
        { ...dataBody, book_file: req.files.book_file[0].filename, image_file: req.files.image_file[0].filename },
        {
          where: {
            id,
          },
        }
      );
    }

    // Select data from database by id
    let data = await books.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Parse to json and add path to book file
    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      book_file: process.env.FILE_PATH + data.book_file,
      image_file: process.env.FILE_PATH + data.image_file,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        book: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    // Checking login is admin
    if (req.user.role != "admin") {
      return res.send({
        status: "failed",
        message: "Only admin to access this feature",
      });
    }

    // Get id from parameter
    const { id } = req.params;

    // Get data book from database to delete book file
    const book = await books.findOne({
      where: {
        id,
      },
    });

    // Checking if book null
    if (book === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Delete data from database
    fs.unlinkSync("uploads/" + book.book_file);
    fs.unlinkSync("uploads/" + book.image_file);
    await books.destroy({
      where: {
        id,
      },
    });

    // Send response to client
    res.send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
