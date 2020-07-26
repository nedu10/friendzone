const RoomModel = require("../models/room.models");
const MessageModel = require("../models/messages.models");
const UserModel = require("../models/users.models");
const UserRoomModel = require("../models/users_room.models");
const moment = require("moment");

exports.getFetchHistory = async (username, room, socket) => {
  try {
    let get_messages = [];
    console.log("rom >> ", room);

    const get_user = await UserModel.findOne({ username: username });
    const get_room = await RoomModel.findOne({ room_title: room });
    const get_user_room = await UserRoomModel.findOne({
      room_id: get_room._id,
      user_id: get_user._id,
    });
    console.log("am here get room >> ", get_room);
    if (get_room) {
      get_messages = await MessageModel.find({
        room_id: get_room._id,
        created_at: { $gte: new Date(get_user_room.created_at) },
      }).populate("user_id");
      //   .populate("user_id");
    }

    console.log(get_messages);

    const refactor_payload = get_messages.forEach((each) => {
      let loop_msgs = {
        bot_name: each.user_id.username,
        message: each.message_body,
        timeStamp: moment(each.created_at).format("MM-DD-YYYY h:mm a"),
      };

      socket.emit("message", loop_msgs);
    });

    return get_messages;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
