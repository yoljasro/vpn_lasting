const { execSync } = require("child_process");

// 🔐 Key generation
function generateKeys() {
  const privateKey = execSync("wg genkey").toString().trim();
  const publicKey = execSync(`echo ${privateKey} | wg pubkey`).toString().trim();
  return { privateKey, publicKey };
}

// ➕ Peer qo‘shish
function addPeer(publicKey, ip) {
  execSync(`wg set wg0 peer ${publicKey} allowed-ips ${ip}/32`);
}

// ⚡ React Native uchun OBJECT config
function buildClientConfig({ privateKey, ip, serverPublicKey, endpoint }) {
  return {
    name: "MyVPN",
    address: `${ip}/32`,
    privateKey,
    dns: ["1.1.1.1"],
    peers: [
      {
        publicKey: serverPublicKey,
        endpoint,
        allowedIps: ["0.0.0.0/0"],
        persistentKeepalive: 25
      }
    ]
  };
}

module.exports = {
  generateKeys,
  addPeer,
  buildClientConfig
};
