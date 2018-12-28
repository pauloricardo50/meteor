// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import adminLoanFragment from '../loanFragments/adminLoanFragment';

describe.only('loan fragments', () => {
  describe('adminLoanFragment', () => {
    it('is complete', () => {
      expect(adminLoanFragment.user.name).to.equal(1);
      expect(adminLoanFragment.user.email).to.equal(1);
    });
  });
});
