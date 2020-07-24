const path = require("path");
const Http = require("http");
const socketio = require("socket.io");
const express = require("express");

const app = express();
const server = Http.createServer(app);
const io = socketio(server);

//set static folder
const get_static_port = express.static(path.join(__dirname, "public"));
app.use(get_static_port);

//Run when client connects
io.on("connection", (socket) => {
  console.log("New Ws Connection...");

  socket.emit("message", "welcome to friendzone"); //to single client

  //   socket.broadcast.emit(); // to all client except client that send t

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });

  //   io.emit(); //To all the client that is connected

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
