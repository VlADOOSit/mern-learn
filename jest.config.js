export default {
	testEnvironment: 'node',
	transform: {},
	moduleNameMapper: {
		'^cookie-parser$': '<rootDir>/tests/mocks/cookieParser.js',
		'^jsonwebtoken$': '<rootDir>/tests/mocks/jsonwebtoken.js',
		'^bcryptjs$': '<rootDir>/tests/mocks/bcryptjs.js',
		'^(\\.{1,2}/.*)\\.js$': '$1'
	}
};
