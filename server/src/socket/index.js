// Import models
const { users, chats } = require("../../models");

// Import operator
const { Op } = require("sequelize");

// Import jwt
const jwt = require("jsonwebtoken");

// Init variable
const connectUser = [];

const socketIo = (io) => {
  // Middlewares
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("client connected : ", socket.id);

    const userId = socket.handshake.query.id;
    connectUser[userId] = socket.id;

    // Load messages
    socket.on("load messages", async (payload) => {
      try {
        const token = socket.handshake.auth.token;
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        const idRecipient = payload;
        const idSender = verified.id;
        const data = await chats.findAll({
          where: {
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: users,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: users,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          order: [["createdAt", "ASC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        socket.emit("messages", data);
      } catch (error) {
        console.log(error);
      }
    });

    // Send message
    socket.on("send message", async (payload) => {
      try {
        const token = socket.handshake.auth.token;
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        const idSender = verified.id;
        const { message, idRecipient } = payload;
        await chats.create({
          message,
          idRecipient,
          idSender,
        });

        io.to(socket.id).to(connectUser[idRecipient]).emit("new message", idRecipient);
      } catch (error) {
        console.log(error);
      }
    });

    // Get admin contact
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await users.findOne({
          where: {
            role: "admin",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });
        socket.emit("admin contact", adminContact);
      } catch (error) {
        console.log(error);
      }
    });

    // Get users contact
    socket.on("load user contacts", async () => {
      try {
        let userContacts = await users.findAll({
          include: [
            {
              model: chats,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chats,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          where: {
            role: "user",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });
        userContacts = JSON.parse(JSON.stringify(userContacts));
        userContacts = userContacts.map((item) => ({
          ...item,
          photo_profile: item.photo_profile ? process.env.FILE_PATH + item.photo_profile : null,
        }));
        socket.emit("user contacts", userContacts);
      } catch (error) {
        console.log(error);
      }
    });

    // If user disconnect
    socket.on("disconnect", () => {
      console.log("client disconnected");

      delete connectUser[userId];
    });
  });
};

module.exports = socketIo;
