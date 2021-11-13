// Import model
const { transaction, users } = require("../../models");

// Import package
const Joi = require("joi");
const fs = require("fs");
const cron = require("node-cron");

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    // Validate data from input json
    const schema = Joi.object({
      account_number: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      fs.unlinkSync("uploads/" + req.file.filename);
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }
    if (!req.file) {
      return res.send({
        status: "failed",
        message: "Please insert file to upload!",
      });
    }

    // Checking id user
    const checkId = await users.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (checkId === null) {
      fs.unlinkSync("uploads/" + req.file.filename);
      return res.send({
        status: "failed",
        message: `User id ${checkId} not found!`,
      });
    }

    // Insert data to database
    const addTransaction = await transaction.create({
      account_number: req.body.account_number,
      transfer_proof: req.file.filename,
      remaining_active: 0,
      user_status: "Not Active",
      payment_status: "Pending",
      user_id: req.user.id,
    });

    // Select data from database
    let data = await transaction.findOne({
      where: {
        id: addTransaction.id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // Add path to transfer proof
    data = {
      ...data.dataValues,
      transfer_proof: process.env.FILE_PATH + data.transfer_proof,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        transaction: data,
      },
    });
  } catch (error) {
    console.log(error);
    fs.unlinkSync("uploads/" + req.file.filename);
    res.send({
      status: "failed",
      message: "Server Error " + req.user.id,
    });
  }
};

// Edit transaction
exports.editTransaction = async (req, res) => {
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

    // Get data from body
    const dataBody = req.body;

    // Check id
    let checkId = await transaction.findOne({
      where: {
        id,
      },
    });
    if (checkId === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Update data from database checking by id
    if (!req.file) {
      if (dataBody.payment_status === "Cancel") {
        await transaction.update(dataBody, {
          where: {
            id,
          },
        });
      } else {
        // Inisiate remaining active variable
        let remainingActive = 29;

        // To get time now
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();

        // First update
        await transaction.update(dataBody, {
          where: {
            id,
          },
        });

        // Updating remaining active
        const task = cron.schedule(`${seconds} ${minutes} ${hours} * * *`, async () => {
          // Get data transaction
          let getTransaction = await transaction.findOne({
            where: {
              id,
            },
          });
          getTransaction = JSON.parse(JSON.stringify(getTransaction));

          // The task will be stopped and completely destroyed
          if (remainingActive === -1) {
            // Update user status
            await transaction.update(
              {
                ...getTransaction,
                user_status: "Not Active",
              },
              {
                where: {
                  id,
                },
              }
            );

            // Update subscribe status to not subscribe
            let getUser = await users.findOne({
              where: {
                id,
              },
            });
            getUser = JSON.parse(JSON.stringify(getUser));
            await users.update(
              {
                ...getUser,
                subscribe_status: false,
              },
              {
                where: {
                  id,
                },
              }
            );

            task.destroy();
          } else {
            // Update data
            await transaction.update(
              {
                ...getTransaction,
                remaining_active: remainingActive,
              },
              {
                where: {
                  id,
                },
              }
            );

            // Subtract remaining active
            remainingActive = remainingActive - 1;
          }
        });
      }
    } else {
      const dataTransaction = await transaction.findOne({
        where: {
          id,
        },
      });
      fs.unlinkSync("uploads/" + dataTransaction.transfer_proof);
      await transaction.update(
        { ...dataBody, transfer_proof: req.file.filename },
        {
          where: {
            id,
          },
        }
      );
    }

    // Select data from database
    let data = await transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // Add path file to transfer proof
    data = {
      ...data.dataValues,
      transfer_proof: process.env.FILE_PATH + data.transfer_proof,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        transaction: data,
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

// Get Transaction
exports.transaction = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Get data from database checking by id
    let data = await transaction.findOne({
      where: {
        user_id: id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // Checking if data null
    if (data === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Add path file to transfer proof
    data = {
      ...data.dataValues,
      transfer_proof: process.env.FILE_PATH + data.transfer_proof,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        transaction: data,
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

// Get all transactions
exports.transactions = async (req, res) => {
  try {
    // Get all data from database
    let data = await transaction.findAll({
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // If data null
    if (data.length === 0) {
      res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Add path file to transfer proof
    data = data.map((item) => {
      return {
        ...item.dataValues,
        transfer_proof: process.env.FILE_PATH + item.dataValues.transfer_proof,
      };
    });

    // Send response to client
    res.send({
      status: "success",
      data: {
        transactions: data,
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

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  let getTransaction = await transaction.findOne({
    where: {
      user_id: id,
      payment_status: "Cancel",
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  getTransaction = JSON.parse(JSON.stringify(getTransaction));

  fs.unlinkSync("uploads/" + getTransaction.transfer_proof);

  await transaction.destroy({
    where: {
      user_id: id,
      payment_status: "Cancel",
    },
  });

  // Send response to client
  res.send({
    status: "success",
    user_id: req.user.id,
  });
};
