const mongoose = require("mongoose");

const User = new mongoose.Schema({
  userName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("user", User);
