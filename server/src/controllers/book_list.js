// Import model
const { book_lists, users, books } = require("../../models");

// Add book list
exports.addBookList = async (req, res) => {
  try {
    const data = req.body;
    const addBookList = await book_lists.create(data);
    let checkAddBookList = await book_lists.findOne({
      where: {
        id: addBookList.id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      include: [
        {
          model: books,
          as: "books",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Parse to json
    checkAddBookList = JSON.parse(JSON.stringify(checkAddBookList));

    res.send({
      status: "success",
      book_lists: {
        data: checkAddBookList,
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

// Delete book list
exports.deleteBookList = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    const checkId = await book_lists.findOne({
      where: {
        book_id: id,
      },
    });
    if (checkId === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Delete data from database
    await book_lists.destroy({
      where: {
        book_id: id,
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

// Get book lists
exports.bookLists = async (req, res) => {
  try {
    let datas = await book_lists.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: users,
          as: "user",
          attributes: {
            exclude: ["password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
        {
          model: books,
          as: "book",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "book_id", "createdAt", "updatedAt"],
      },
    });

    // If data null
    if (datas.length === 0) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Parse to json and map data item
    datas = JSON.parse(JSON.stringify(datas));
    datas = datas.map((item) => {
      return {
        ...item.book,
        book_file: process.env.FILE_PATH + item.book.book_file,
        image_file: process.env.FILE_PATH + item.book.image_file,
      };
    });

    // Send response to client
    res.send({
      status: "success",
      data: datas,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
