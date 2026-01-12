function allocateIp(index) {
  return `10.0.0.${index + 2}`;
}

module.exports = { allocateIp };
