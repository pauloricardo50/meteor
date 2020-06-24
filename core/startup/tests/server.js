// Set up for running client tests

import 'core/api/methods/server/test/serverMethods-app-test.js';

// Add a single test so mocha wan't fail due to no tests
describe('backend-helpers', () => {
  it('should run', () => {});
});
