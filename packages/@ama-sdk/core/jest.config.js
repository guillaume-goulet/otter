const getJestConfig = require('../../../jest.config.ut').getJestConfig;

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  ...getJestConfig(__dirname, false),
  displayName: require('./package.json').name,
  fakeTimers: {
    enableGlobally: true,
    // TODO try to make date utils work with fake Date
    doNotFake: ['Date']
  }
};
