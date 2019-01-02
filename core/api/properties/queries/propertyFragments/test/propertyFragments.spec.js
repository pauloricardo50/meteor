// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import adminPropertyFragment from '../adminPropertyFragment';

describe('property fragments', () => {
  describe('adminPropertyFragment', () => {
    it('should have loans', () => {
      expect(adminPropertyFragment.loans).to.not.equal(undefined);
      expect(adminPropertyFragment.loans).to.deep.include({ name: 1 });
    });
  });
});
