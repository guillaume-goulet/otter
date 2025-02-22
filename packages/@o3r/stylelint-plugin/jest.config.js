const getJestConfig = require('../../../jest.config.ut').getJestConfig;

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  ...getJestConfig(__dirname, false),
  displayName: require('./package.json').name,
  setupFiles: ['<rootDir>/testing/jest.setup.ts'],
  setupFilesAfterEnv: null,
  testEnvironment: 'node'
};
