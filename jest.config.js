// jest.config.js
module.exports = {
    // ...
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testTimeout: 10000,
    testEnvironment: 'jsdom',
    // ...
  };