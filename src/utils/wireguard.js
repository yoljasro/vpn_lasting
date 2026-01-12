const { execSync } = require("child_process");

function generateKeys(clientId) {
  const privateKey = execSync("wg genkey").toString().trim();
  const publicKey = execSync(`echo ${privateKey} | wg pubkey`).toString().trim();
  return { privateKey, publicKey };
}

function addPeer(publicKey, ip) {
  execSync(`wg set wg0 peer ${publicKey} allowed-ips ${ip}/32`);
}

function saveClientConfig({ privateKey, ip, serverPublicKey, endpoint }) {
  return `
[Interface]
PrivateKey = ${privateKey}
Address = ${ip}/32
DNS = 1.1.1.1

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${endpoint}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
`.trim();
}

module.exports = { generateKeys, addPeer, saveClientConfig };
