/* eslint-env mocha */
import { expect } from 'chai';

import {
  rateLimitedErrorMethod,
  rateLimitedMethod,
} from '../../methods-app-test';

describe('clientMethods', function() {
  this.timeout(10000);

  describe('rate limit', () => {
    beforeEach(done => {
      // Must wait 1sec to clear rate-limit
      setTimeout(() => {
        done();
      }, 1000);
    });

    it('throws if rate limit is reached', async () => {
      await rateLimitedMethod.run({});

      try {
        await rateLimitedMethod.run({});
        expect(1).to.equal(0, 'Should throw');
      } catch (error) {
        expect(error.reason).to.contain('Doucement');
      }
    });

    it('does not throw if the rate limit is not reached', async () => {
      await rateLimitedMethod.run({});
      setTimeout(async () => {
        const res = await rateLimitedMethod.run({});
        expect(res).to.equal(true);
      }, 1000);
    });

    it('clears the rate limit if a server error is thrown', async () => {
      try {
        await rateLimitedErrorMethod.run({});
      } catch (error) {
        expect(error.message).to.contain('Error thrown');
      }

      try {
        await rateLimitedErrorMethod.run({});
      } catch (error) {
        expect(error.message).to.contain('Error thrown');
      }

      try {
        await rateLimitedErrorMethod.run({});
      } catch (error) {
        expect(error.message).to.contain('Error thrown');
      }
    });
  });
});
