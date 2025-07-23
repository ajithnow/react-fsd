import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          verbatimModuleSyntax: false,
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,ts,tsx}',
    'src/**/*.{js,ts,tsx}',
    '!src/*.tsx',
    '!src/**/*.test.{js,ts,tsx}',
    '!src/lib/**',
    '!src/core/**',
    '!src/**/**/constants/**',
    '!src/**/**/mocks/**',
    '!src/**/**/pages/**',
    '!src/**/**/models/**',
    '!src/**/**/config/**',
    '!src/**/**/schema/**',
    '!src/**/**/services/**',
    '!src/**/**/routes/**',
    '!src/**/**/locales/**',
    '!src/**/**/queries/**',
    '!src/**/**/stores/**',
    '!src/**/*.d.{js,ts}',
    '!src/features/*.ts',
    '!docs',
  ],
};

export default config;
