const connectDb = require("./config/db");
const UserModel = require("./models/users.models");
const RoomModel = require("./models/room.models");
const UserRoomModel = require("./models/users_room.models");
const MessageModel = require("./models/messages.models");

const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Http = require("http");
const socketio = require("socket.io");
const express = require("express");

const app = express();
const server = Http.createServer(app);
const io = socketio.listen(server);

connectDb();

const bot_name = "zone bot";

// console.log("here");
//Run when client connects
io.on("connection", (socket) => {
  console.log("New Ws Connection...");

  socket.on("joinRoom", async (data) => {
    try {
      let get_user = await UserModel.findOne({ username: data.username });
      if (!get_user) {
        get_user = await UserModel.create({ username: data.username });
      }
      // console.log("get_user >> ", get_user);
      let get_room = await RoomModel.findOne({ room_title: data.room });
      if (!get_room) {
        get_room = await RoomModel.create({ room_title: data.room });
      }
      // console.log("get_room >> ", get_room);
      let get_user_room = await UserRoomModel.findOne({
        user_id: get_user.id,
        room_id: get_room.id,
      });
      if (!get_user_room) {
        get_user_room = await UserRoomModel.create({
          user_id: get_user.id,
          room_id: get_room.id,
        });
      }
      // console.log("get_user_room >> ", get_user_room);

      socket.join(get_room.room_title);

      socket.emit("message", { bot_name, message: "welcome to friendzone" }); //to single client

      socket.broadcast.to(get_room.room_title).emit("message", {
        bot_name,
        message: `${get_user.username} Just join the chat`,
      });
    } catch (error) {
      console.log("error >> ", error);
    }
  });

  //   socket.broadcast.emit(); // to all client except client that send t

  socket.on("chatMessage", async (msg) => {
    try {
      console.log("msg >> ", msg);
      const get_room = await RoomModel.findOne({ room_title: msg.room.trim() });
      const get_user = await UserModel.findOne({
        username: msg.username.trim(),
      });
      if (get_room && get_user) {
        await MessageModel.create({
          user_id: get_user.id,
          room_id: get_room.id,
          message_body: msg.msg,
        });
        io.to(msg.room.trim()).emit("message", {
          message: msg.msg,
          bot_name: msg.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("fetchRoomHistory", async (room) => {
    let get_messages = [];
    console.log("rom >> ", room);

    const get_room = await RoomModel.findOne({ room_title: room.room });
    if (get_room) {
      get_messages = await MessageModel.find({ room_id: get_room.id })
        .populate("user_id")
        .populate("user_id");
    }

    console.log(get_messages);

    const refactor_payload = get_messages.forEach((each) => {
      let loop_msgs = {
        bot_name: each.user_id.username,
        message: each.message_body,
      };

      socket.emit("message", loop_msgs);
    });

    return get_messages;
  });

  //   io.emit(); //To all the client that is connected

  socket.on("disconnect", () => {
    io.emit("message", { bot_name, message: "A user has left the chat" });
  });
});

//set static folder
const get_static_port = express.static(path.join(__dirname, "public"));
app.use(get_static_port);

server.listen(process.env.PORT || process.env.port, (err) => {
  if (err) console.err(err);
  console.info(`Server started on port ${process.env.port}`);
});
