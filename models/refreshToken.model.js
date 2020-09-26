const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
