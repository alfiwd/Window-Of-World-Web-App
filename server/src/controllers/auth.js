// Import model
const { users } = require("../../models");

// Import package
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    // Validate data from input json
    const schema = Joi.object({
      full_name: Joi.string().min(3).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(5).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    // Checking email already registered
    const emailRegistered = await users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailRegistered) {
      return res.send({
        status: "failed",
        message: "Email has already registered",
      });
    }

    // Encrypt password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Insert to query
    await users.create({
      email: req.body.email,
      password: hashedPassword,
      full_name: req.body.full_name,
      subscribe_status: false,
      role: "user",
    });

    // Create token
    const dataToken = {
      id: req.body.id,
      role: req.body.role,
    };
    const token = jwt.sign(dataToken, process.env.SECRET_KEY);

    // Create variable user to show data
    const user = {
      email: req.body.email,
      token: token,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        user,
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

// Login
exports.login = async (req, res) => {
  try {
    // Get data from body
    const dataLogin = req.body;

    // Validate data from input json
    const schema = Joi.object({
      email: Joi.string().email().min(5).required(),
      password: Joi.string().min(5).required(),
    });
    const { error } = schema.validate(dataLogin);
    if (error) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    // Check data from input json to database
    const userExist = await users.findOne({
      where: {
        email: dataLogin.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!userExist) {
      return res.send({
        status: "failed",
        message: "Email and password doesn't match!",
      });
    }

    // Matching password from input json with database
    const isValid = await bcrypt.compare(dataLogin.password, userExist.password);
    const dataToken = {
      id: userExist.id,
      role: userExist.role,
    };
    if (!isValid) {
      return res.send({
        status: "failed",
        message: "Email and password doesn't match!",
      });
    }

    // Create token
    const token = jwt.sign(dataToken, process.env.SECRET_KEY);

    // Create variable user to show data
    const user = {
      id: userExist.id,
      email: userExist.email,
      full_name: userExist.full_name,
      subscribe_status: userExist.subscribe_status,
      role: userExist.role,
      token: token,
    };

    // Send response to client
    res.send({
      status: "success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Check auth
exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          full_name: dataUser.full_name,
          email: dataUser.email,
          role: dataUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
