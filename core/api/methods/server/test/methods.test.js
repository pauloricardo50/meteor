/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import methods from '../../registerMethodDefinitions';

describe('methods', () => {
  after(() => {
    // resetDatabase();
  });

  Object.keys(methods).forEach((methodName) => {
    const method = methods[methodName];
    describe(`method ${methodName}`, () => {
      it('is defined', () =>
        method.run({}).catch((error) => {
          expect(error.error).to.not.equal(404);
        }));
    });
  });
});
