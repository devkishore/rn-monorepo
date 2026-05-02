/**
 * Jest Configuration for @rn-monorepo/api
 */

module.exports = {
  displayName: '@rn-monorepo/api',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.{test,spec}.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  errorOnDeprecated: true,
};
