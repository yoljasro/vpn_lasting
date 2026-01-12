

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const vpnRoutes = require("./src/routes/vpn");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vpn", vpnRoutes);

mongoose.connect("mongodb+srv://saidaliyevjasur450_db_user:irpVfZLLCH07uETG@vpn.lvwwvtq.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(process.env.PORT || 4000, () => {
  console.log("Backend running on port", process.env.PORT || 4000);
});
