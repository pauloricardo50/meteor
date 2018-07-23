/* eslint-env mocha */
import { expect } from 'chai';

import { INTEREST_RATES } from 'core/api/constants';
import interestRates, { TRENDS } from '../interestRates';

describe('interestRates', () => {
  it('should be an array of objects', () => {
    interestRates.forEach((rate, index) =>
      expect(typeof rate).to.equal('object', index),
    );
  });

  it('each interest rate should have a type from a constant', () => {
    interestRates.forEach(rate =>
      expect(Object.values(INTEREST_RATES).indexOf(rate.type)).to.be.above(
        -1,
        rate.type,
      ),
    );
  });

  it('each interest rate should have a trend from a constant', () => {
    interestRates.forEach(rate =>
      expect(Object.values(TRENDS).indexOf(rate.trend)).to.be.above(
        -1,
        rate.trend,
      ),
    );
  });

  it('rateLow and rateHigh should be between 0.5% and 3%', () => {
    interestRates.forEach(rate => {
      expect(rate.rateLow).to.be.at.least(0.005);
      expect(rate.rateHigh).to.be.at.most(0.03);
    });
  });

  // This does not apply
  it.skip('each rate should be higher than the previous one', () => {
    interestRates.forEach((rate, index, array) => {
      if (index > 0) {
        expect(rate.rateLow).to.be.above(array[index - 1].rateLow);
        expect(rate.rateHigh).to.be.above(array[index - 1].rateHigh);
      }
    });
  });
});
