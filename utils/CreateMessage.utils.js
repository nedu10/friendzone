const RoomModel = require("../models/room.models");
const MessageModel = require("../models/messages.models");
const UserModel = require("../models/users.models");

exports.createMsg = async (msg) => {
  try {
    console.log("msg >> ", msg);
    const get_room = await RoomModel.findOne({ room_title: msg.room.trim() });
    let get_user = null;
    if (msg.username) {
      get_user = await UserModel.findOne({
        username: msg.username.trim(),
      });
      if (get_room && get_user) {
        await MessageModel.create({
          user_id: get_user._id,
          room_id: get_room._id,
          message_body: msg.msg,
        });
      }
    } else {
      if (get_room) {
        await MessageModel.create({
          room_id: get_room._id,
          message_body: msg.msg,
        });
      }
    }

    return { get_room, get_user };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
