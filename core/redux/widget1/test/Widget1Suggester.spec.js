/* eslint-env mocha */
import { expect } from 'chai';

import Widget1Suggester from '../Widget1Suggester';

describe('Widget1SuggesterClass', () => {
  describe('getMaxPossibleLoan', () => {
    it('returns the hard cap if salary is not a problem', () => {
      expect(
        Widget1Suggester.getMaxPossibleLoan({ property: 10000, salary: 5000 }),
      ).to.equal(8000);
    });
    it('returns a value modified by salary', () => {
      expect(
        Widget1Suggester.getMaxPossibleLoan({
          property: 1000000,
          salary: 120000,
        }),
      ).to.equal(600000);
    });
  });
});
