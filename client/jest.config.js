module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // กำหนดให้แปลงไฟล์จาก axios
  ],
};