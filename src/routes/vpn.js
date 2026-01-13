const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Client = require("../models/Client");
const { generateKeys, addPeer, buildClientConfig } = require("../utils/wireguard");
const { allocateIp } = require("../utils/ipAllocator");

const router = express.Router();

router.post("/connect", async (req, res) => {
  try {
    let { deviceId } = req.body;
    if (!deviceId) deviceId = uuidv4();

    let client = await Client.findOne({ deviceId });

    if (!client) {
      const count = await Client.countDocuments();
      const ip = allocateIp(count);

      const { privateKey, publicKey } = generateKeys();
      addPeer(publicKey, ip);

      client = await Client.create({
        deviceId,
        publicKey,
        privateKey,
        ip
      });
    }

    const config = buildClientConfig({
      privateKey: client.privateKey,
      ip: client.ip,
      serverPublicKey: process.env.SERVER_PUBLIC_KEY,
      endpoint: process.env.SERVER_ENDPOINT
    });

    res.json({
      success: true,
      deviceId,
      config
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
