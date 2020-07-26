const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4 } = require("uuid");

const messageSchema = new Schema(
  {
    _id: { type: String, default: v4 },
    message_body: { type: String, trim: true },
    user_id: {
      type: String,
      ref: "User",
      default: null,
    },
    room_id: {
      type: String,
      ref: "Room",
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Message", messageSchema);
