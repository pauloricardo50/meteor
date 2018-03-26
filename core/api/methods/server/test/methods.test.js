/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import methods from '../../registerMethodDefinitions';
import { getRateLimitedMethods } from '../../../../utils/rate-limit';

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

      // In the future, remove the if conditional to test that all methods
      // are rate-limited
      if (methodName === 'impersonateUser') {
        it('is rate-limited', () => {
          expect(getRateLimitedMethods()).to.include(methodName);
        });
      }
    });
  });
});
