//      
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import InterestRatesService from '../InterestRatesService';
import { interestRates } from '../../../fragments'

describe('InterestRatesService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('insert', () => {
    it('rounds interest rates', () => {
      const id = InterestRatesService.insert({
        interest10: { rateLow: 0.01234 },
        date: new Date(),
      });
      const rates = InterestRatesService.get(id, interestRates());
      expect(rates.interest10).to.deep.equal({ rateLow: 0.0123 });
    });

    it('does not fail when rounding some values', () => {
      const id = InterestRatesService.insert({
        interest10: { rateLow: 0.0093 },
        date: new Date(),
      });
      const rates = InterestRatesService.get(id, interestRates());
      expect(rates.interest10).to.deep.equal({ rateLow: 0.0093 });
    });
  });
});
