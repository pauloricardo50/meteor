/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */

import callerPath from 'caller-path';
import { dirname, resolve } from 'path';

import meteorStubs from '/imports/js/helpers/meteorStubs';

const testRequire = (filePath) => {
  const realPath = resolve(dirname(callerPath()), filePath);
  let importedModule;

  if (global.Meteor) {
    // If this test is happening in a meteor environment, import it directly
    importedModule = false;
  } else {
    // If this is a local environment, like wallabyJS, import it with proxyquire
    // and stubs
    const proxyquire = require('proxyquire');
    importedModule = proxyquire(realPath, meteorStubs);
  }

  return importedModule;
};

export default testRequire;
