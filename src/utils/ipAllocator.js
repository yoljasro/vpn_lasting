// Minimal IP allocator
function allocateIp(index) {
  return `10.0.0.${index + 2}`; // 10.0.0.2 dan boshlanadi
}

module.exports = { allocateIp };
