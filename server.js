const connectDb = require("./config/db");
const UserModel = require("./models/users.models");
const RoomModel = require("./models/room.models");
const UserRoomModel = require("./models/users_room.models");
const MessageModel = require("./models/messages.models");

// import utils
const { getFetchHistory } = require("./utils/FetchHistory.utils");
const { createMsg } = require("./utils/CreateMessage.utils");

const path = require("path");
const moment = require("moment");
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
        user_id: get_user._id,
        room_id: get_room._id,
      });

      if (get_user_room) {
        await getFetchHistory(data.username, data.room, socket);
      }
      if (!get_user_room) {
        get_user_room = await UserRoomModel.create({
          user_id: get_user._id,
          room_id: get_room._id,
        });

        await createMsg({
          room: data.room,
          msg: `${get_user.username} Just join the chat`,
        });

        socket.emit("message", {
          bot_name,
          message: "welcome to friendzone",
          timeStamp: moment().format("MM-DD-YYYY h:mm a"),
        }); //to single client

        socket.broadcast.to(get_room.room_title).emit("message", {
          bot_name,
          message: `${get_user.username} Just join the chat`,
          timeStamp: moment().format("MM-DD-YYYY h:mm a"),
        });
      }

      socket.join(get_room.room_title);

      const users = await UserRoomModel.find({
        room_id: get_room.id,
      }).populate("user_id");

      // console.log("users >> ", data.room, users);

      io.to(data.room).emit("roomUsers", { room: data.room, users });

      // console.log("get_user_room >> ", get_user_room);
    } catch (error) {
      console.log("error >> ", error);
    }
  });

  //   socket.broadcast.emit(); // to all client except client that send t

  socket.on("chatMessage", async (msg) => {
    try {
      // console.log("msg >> ", msg);
      const create_msg = await createMsg(msg);
      if (create_msg.get_room && create_msg.get_user) {
        io.to(msg.room.trim()).emit("message", {
          message: msg.msg,
          bot_name: msg.username,
          timeStamp: moment().format("MM-DD-YYYY h:mm a"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("fetchRoomHistory", async (room) => {
    await getFetchHistory(room.room, socket);
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
