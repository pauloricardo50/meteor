import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import { INSURANCE_POTENTIAL } from '../../../loans/loanConstants';
import LoanService from '../../../loans/server/LoanService';
import { down, up } from '../40';

/* eslint-env-mocha */

describe('Migration 40', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('sets insurancePotential to VALIDATED if insurance requests are linked', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        insuranceRequestLinks: [{ _id: 'iR' }],
      });

      await up();

      const { insurancePotential } = LoanService.get('loan', {
        insurancePotential: 1,
      });

      expect(insurancePotential).to.equal(INSURANCE_POTENTIAL.VALIDATED);
    });

    it('does not set insurancePotential to VALIDATED if insurance no requests are linked', async () => {
      await LoanService.rawCollection.insert({ _id: 'loan' });

      await up();

      const { insurancePotential } = LoanService.get('loan', {
        insurancePotential: 1,
      });

      expect(insurancePotential).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('unset insurancePotential if it was VALIDATED', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        insurancePotential: INSURANCE_POTENTIAL.VALIDATED,
      });

      await down();

      const { insurancePotential } = LoanService.get('loan', {
        insurancePotential: 1,
      });

      expect(insurancePotential).to.equal(undefined);
    });
  });
});
