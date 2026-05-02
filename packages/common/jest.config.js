/**
 * Jest Configuration for @rn-monorepo/common
 * 
 * Production-stable setup with ts-jest for TypeScript support.
 * - Uses ts-jest preset for reliable TypeScript transformation
 * - Coverage thresholds: branches 70%, functions 80%, lines 80%, statements 80%
 * - Test environment: Node (for utilities); can be extended for component tests
 * - Root source: src/**
 */

module.exports = {
  displayName: '@rn-monorepo/common',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/index.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  errorOnDeprecated: true,
};
