/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */

import callerPath from 'caller-path';
import { dirname, resolve } from 'path';

import meteorStubs from './meteorStubs';

const testRequire = (filePath) => {
  let importedModule;

  if (global.Meteor) {
    // If this test is happening in a meteor environment, return false
    // and require it in the file
    importedModule = false;
  } else {
    // If this is a local environment, like wallabyJS, import it with proxyquire
    // and stubs
    const proxyquire = require('proxyquire');
    const realPath = resolve(dirname(callerPath()), filePath);
    importedModule = proxyquire(realPath, meteorStubs);
  }

  return importedModule;
};

export default testRequire;
