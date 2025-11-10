import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
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
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
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
    '!src/*.{js,ts,tsx}',
  ],
};

export default config;
