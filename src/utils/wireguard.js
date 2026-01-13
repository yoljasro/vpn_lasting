const { execSync } = require("child_process");

function generateKeys() {
  const privateKey = execSync("wg genkey").toString().trim();
  const publicKey = execSync(`echo ${privateKey} | wg pubkey`).toString().trim();
  return { privateKey, publicKey };
}

function addPeer(publicKey, ip) {
  // Peerni serverga qo‘shish
  execSync(`wg set wg0 peer ${publicKey} allowed-ips ${ip}/32`);
}

// Configni object holatda yuboradi, RN bilan moslash
function saveClientConfig({ privateKey, ip, serverPublicKey, endpoint }) {
  return {
    name: "MyVPN",
    privateKey,
    ip,
    serverPublicKey,
    endpoint,
    dns: "1.1.1.1",
    allowedIPs: "0.0.0.0/0",
    persistentKeepalive: 25
  };
}

module.exports = { generateKeys, addPeer, saveClientConfig };
