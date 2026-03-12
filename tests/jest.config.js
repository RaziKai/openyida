module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'skills/**/*.js',
    'shared/**/*.js',
    '!**/*.test.js',
    '!**/*.spec.js'
  ],
  coverageDirectory: 'tests/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000,
  modulePathIgnorePatterns: ['<rootDir>/node_modules/']
};
