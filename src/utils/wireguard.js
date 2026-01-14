const { execSync } = require("child_process");
const fs = require("fs");

/**
 * Generates a massive private/public keypair for WireGuard
 */
function generateKeys() {
  const privateKey = execSync("wg genkey").toString().trim();
  const publicKey = execSync(`echo ${privateKey} | wg pubkey`).toString().trim();
  return { privateKey, publicKey };
}

/**
 * Allocates an IP address based on the client count.
 * Server is 10.0.0.1, so clients start at 10.0.0.2.
 */
function allocateIp(count) {
  const offset = count + 2; 
  return `10.0.0.${offset}`;
}

/**
 * Adds a peer to the running interface AND persists it to wg0.conf
 */
function addPeer(publicKey, ip) {
  try {
    // 1. Add to running interface
    execSync(`wg set wg0 peer ${publicKey} allowed-ips ${ip}/32`);
    console.log(`Added peer ${ip} to running wg0 interface`);

    // 2. Persist to configuration file
    const peerConfig = `
[Peer]
# Client IP: ${ip}
PublicKey = ${publicKey}
AllowedIPs = ${ip}/32
`;
    // Append to the file (requires root permissions)
    fs.appendFileSync("/etc/wireguard/wg0.conf", peerConfig);
    console.log(`Persisted peer ${ip} to /etc/wireguard/wg0.conf`);

  } catch (error) {
    console.error("Failed to add peer:", error.message);
    throw error;
  }
}

/**
 * Builds the client configuration object.
 * Note: Added MTU 1280 for mobile network compatibility.
 */
function buildClientConfig({ privateKey, ip, serverPublicKey, endpoint }) {
  return {
    name: "MyVPN",
    interface: {
        address: `${ip}/32`,
        privateKey,
        dns: ["1.1.1.1", "8.8.8.8"],
        mtu: 1280 // CRITICAL FIX for mobile data
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
