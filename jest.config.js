/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  resolver: 'ts-jest-resolver',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts'],
  verbose: true,
};
