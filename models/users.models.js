const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4 } = require("uuid");

const userSchema = new Schema(
  {
    _id: { type: String, default: v4 },
    username: { type: String, unique: true, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
