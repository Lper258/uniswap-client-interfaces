// this allows us to use es6, es2017, es2018 syntax (const, spread operators outside of array literals, etc.)
/* eslint-env es6, es2017, es2018 */

const preset = require('../../config/jest-presets/jest/jest-preset')

module.exports = {
  ...preset,
  transform: {
    '\\.svg$': 'jest-transformer-svg',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // this avoids type checking other modules
        isolatedModules: true
      },
    ],
  },
  displayName: 'UI Package',
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.stories.**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
  setupFilesAfterEnv: [
    '../../config/jest-presets/jest/setup.js',
  ],
}
