const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4 } = require("uuid");

const groupSchema = new Schema(
  {
    id: { type: String, default: v4 },
    group_title: { type: String, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Group", groupSchema);
