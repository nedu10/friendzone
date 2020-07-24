const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4 } = require("uuid");

const user_groupSchema = new Schema(
  {
    id: { type: String, default: v4 },
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

module.exports = mongoose.model("UserGroup", user_groupSchema);
