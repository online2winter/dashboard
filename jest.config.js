module.exports = {
roots: ['<rootDir>/src'],
testEnvironment: 'jsdom',
moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
collectCoverage: true,
collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/serviceWorker.js',
    '!src/**/*.d.ts',
],
moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|ico|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
},
testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx}'],
testEnvironmentOptions: {
    url: 'http://localhost'
},
transform: {
    '^.+\\.(js|jsx|mjs|cjs)$': '<rootDir>/node_modules/babel-jest'
},
transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs)$',
    '^.+\\.module\\.(css|sass|scss)$'
],
moduleDirectories: ['node_modules', 'src']
};
