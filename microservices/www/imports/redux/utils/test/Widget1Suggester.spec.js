/* eslint-env mocha */
import { expect } from 'chai';

import Widget1Suggester from '../Widget1Suggester';

describe('Widget1SuggesterClass', () => {
  describe('getMaxPossibleLoan', () => {
    it('returns the hard cap if salary is not a problem', () => {
      expect(Widget1Suggester.getMaxPossibleLoan({ property: 100, salary: 50 })).to.equal(80);
    });
    it('returns a value modified by salary', () => {
      expect(Widget1Suggester.getMaxPossibleLoan({ property: 1000, salary: 120 })).to.equal(600);
    });
  });
});
