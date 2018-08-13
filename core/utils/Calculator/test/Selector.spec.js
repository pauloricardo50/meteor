// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';

describe('Calculator Selector', () => {
  let params;

  beforeEach(() => {
    params = { loan: { structure: {} } };
  });

  describe('getInsuranceWithdrawn', () => {
    it('returns 0 if nothing exists', () => {
      expect(Calculator.getInsuranceWithdrawn(params)).to.equal(0);
    });

    it('sums withrawn stuff', () => {
      params.loan.structure.secondPillarWithdrawal = 1;
      params.loan.structure.thirdPillarWithdrawal = 2;
      expect(Calculator.getInsuranceWithdrawn(params)).to.equal(3);
    });
  });

  describe('getInsurancePledged', () => {
    it('returns 0 if nothing exists', () => {
      expect(Calculator.getInsurancePledged(params)).to.equal(0);
    });

    it('sums pledged stuff', () => {
      params.loan.structure.secondPillarPledged = 1;
      params.loan.structure.thirdPillarPledged = 2;
      expect(Calculator.getInsurancePledged(params)).to.equal(3);
    });
  });
});
