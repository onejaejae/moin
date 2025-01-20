const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: ['.*\\.spec\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  testTimeout: 30000,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^libs/(.*)$': '<rootDir>/libs/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
  },
};

if (process.env.NODE_ENV === 'local') {
  config.testRegex.push('.*\\.test\\.ts$');
}

module.exports = config;
