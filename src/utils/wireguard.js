const { execSync } = require("child_process");
const fs = require("fs");

// 🔐 Key generation
function generateKeys() {
  const privateKey = execSync("wg genkey").toString().trim();
  const publicKey = execSync(`echo ${privateKey} | wg pubkey`).toString().trim();
  return { privateKey, publicKey };
}

// 🌐 IP Allocation
// CHANGED: Generating 10.7.0.x IPs as requested
function allocateIp(count) {
  const offset = count + 2; 
  return `10.7.0.${offset}`;
}

// ➕ Add peer
function addPeer(publicKey, ip) {
  try {
    execSync(`wg set wg0 peer ${publicKey} allowed-ips ${ip}/32`);
    console.log(`[Server] Peer ${ip} added to memory.`);

    const peerConfig = `
[Peer]
# Client ${ip}
PublicKey = ${publicKey}
AllowedIPs = ${ip}/32
`;
    fs.appendFileSync("/etc/wireguard/wg0.conf", peerConfig);
    console.log(`[Server] Peer ${ip} saved to wg0.conf`);

  } catch (err) {
    console.error("Error adding peer:", err.message);
    throw err;
  }
}

// ⚡️ Client Config
function buildClientConfig({ privateKey, ip, serverPublicKey, endpoint }) {
  return {
    name: "MyVPN", 
    interface: {
       address: `${ip}/32`,
       privateKey,
       dns: ["1.1.1.1", "8.8.8.8"],
       mtu: 1280
    },
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
  allocateIp,
  addPeer,
  buildClientConfig
};