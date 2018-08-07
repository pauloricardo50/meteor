// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import DefaultCalculator, { Calculator } from '..';

describe('LoanCalculator', () => {
  describe('getProjectValue', () => {
    it('returns 0 if the property value is 0 or does not exist', () => {
      expect(DefaultCalculator.getProjectValue({ loan: { structure: {} } })).to.equal(0);
      expect(DefaultCalculator.getProjectValue({
        loan: { structure: { property: { value: 0 } }, propertyWork: 100 },
      })).to.equal(0);
    });

    it('uses notaryFees passed in the constructor', () => {
      const calc = new Calculator({ notaryFees: 1, hello: 'world' });
      expect(calc.getProjectValue({
        loan: { structure: { property: { value: 100 } } },
      })).to.equal(200);
    });

    it('calculates project with propertyValue, notary fees and propertyWork', () => {
      expect(DefaultCalculator.getProjectValue({
        loan: { structure: { property: { value: 100 }, propertyWork: 50 } },
      })).to.equal(155);
    });
  });
});
