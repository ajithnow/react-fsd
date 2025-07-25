import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/src/test-types.d.ts',
  ],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          jsx: 'react-jsx',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          types: ['jest', '@testing-library/jest-dom', 'node'],
          skipLibCheck: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
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
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,ts,tsx}',
    '!src/*.tsx',
    '!src/features/*.{js,ts,tsx}',
    '!src/**/*.demo.{js,ts,tsx}',
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
    '!docs',
    '!**/index.{ts,tsx}',
  ],
};

export default config;
