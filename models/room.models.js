const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4 } = require("uuid");

const groupSchema = new Schema(
  {
    _id: { type: String, default: v4 },
    room_title: { type: String, unique: true, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Room", groupSchema);
