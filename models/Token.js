const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    expires: 900,
  },
});

module.exports = mongoose.model("Token", TokenSchema);
