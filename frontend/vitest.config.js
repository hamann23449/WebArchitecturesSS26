// Minimal Vitest config to run unit tests without loading the project's Vite config
// Runs tests in a Node-like environment so pure logic tests work without browser tooling.
module.exports = {
  test: {
    environment: 'node',
    globals: false,
  },
}
