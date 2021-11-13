// Import package
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Get routes to the variable
const router = require("./src/routes/index");

const app = express();

// For socket io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // we must define cors because our client and server have diffe
    // origin: process.env.CLIENT_URL,
  },
});

// import socket function and call with parameter io
require("./src/socket")(io);

const port = 5000;

app.use(express.json());
app.use(cors());

// Create endpoint grouping and router
app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

server.listen(port, () => console.log(`Listening on port ${port}`));
