const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Client = require("../models/Client");
const { generateKeys, addPeer, saveClientConfig } = require("../utils/wireguard");
const { allocateIp } = require("../utils/ipAllocator");

const router = express.Router();

router.post("/connect", async (req, res) => {
  try {
    const userId = uuidv4();
    const count = await Client.countDocuments();
    const ip = allocateIp(count);

    const { privateKey, publicKey } = generateKeys(userId);

    addPeer(publicKey, ip);

    await Client.create({
      userId,
      publicKey,
      privateKey,
      ip
    });

    const config = saveClientConfig({
      privateKey,
      ip,
      serverPublicKey: process.env.SERVER_PUBLIC_KEY,
      endpoint: process.env.SERVER_ENDPOINT
    });

    res.json({
      success: true,
      config
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
