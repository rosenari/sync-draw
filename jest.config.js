module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.css$': './jest-config/style-mock.js'
    }
}