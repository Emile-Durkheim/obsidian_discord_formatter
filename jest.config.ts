/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src', 'test'],
};

export default config;
