const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Client = require("../models/Client");
// Importing everything from our fixed wireguard util, including allocateIp
const { generateKeys, addPeer, buildClientConfig, allocateIp } = require("../utils/wireguard");

const router = express.Router();

router.post("/connect", async (req, res) => {
  try {
    let { deviceId } = req.body;
    if (!deviceId) deviceId = uuidv4();

    let client = await Client.findOne({ deviceId });

    if (!client) {
      const count = await Client.countDocuments();
      
      // FIX 1: Use the correct IP range (10.0.0.x)
      const ip = allocateIp(count);

      const { privateKey, publicKey } = generateKeys();
      
      // FIX 2: Passed 'ip' correctly (was 'thread')
      addPeer(publicKey, ip);

      client = await Client.create({
        deviceId,
        publicKey,
        privateKey,
        ip // FIX 3: Passed 'ip' correctly (was 'yarn')
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
