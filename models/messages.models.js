const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4 } = require("uuid");

const messageSchema = new Schema(
  {
    id: { type: String, default: v4 },
    message_body: { type: String, trim: true },
    user_id: {
      type: String,
      ref: "User",
    },
    group_id: {
      type: String,
      ref: "Group",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Message", messageSchema);
