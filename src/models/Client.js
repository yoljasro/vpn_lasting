const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  userId: String,
  publicKey: String,
  privateKey: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", clientSchema);
