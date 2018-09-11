// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import {
  chooseOwnFundsTypes,
  shouldAskForUsageType,
  calculateRemainingFunds,
} from '../FinancingStructuresOwnFundsPickerHelpers';
import {
  RESIDENCE_TYPE,
  OWN_FUNDS_TYPES,
} from '../../../../../../api/constants';

describe('FinancingStructuresOwnFundsPickerHelpers', () => {
  describe('chooseOwnFundsTypes', () => {
    it('returns the right values for main', () => {
      expect(chooseOwnFundsTypes({
        loan: { general: { residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE } },
      })).to.deep.equal(Object.values(OWN_FUNDS_TYPES));
    });

    it('returns the right values for secondary and investment', () => {
      const expected = [
        OWN_FUNDS_TYPES.BANK_FORTUNE,
        OWN_FUNDS_TYPES.INSURANCE_3B,
        OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
      ];

      expect(chooseOwnFundsTypes({
        loan: { general: { residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE } },
      })).to.deep.equal(expected);

      expect(chooseOwnFundsTypes({
        loan: { general: { residenceType: RESIDENCE_TYPE.INVESTMENT } },
      })).to.deep.equal(expected);
    });
  });

  describe('shouldAskForUsageType', () => {
    it('should return true for the right own funds types', () => {
      expect(shouldAskForUsageType(OWN_FUNDS_TYPES.INSURANCE_2)).to.equal(true);
    });

    it('should return false for the other own funds types', () => {
      expect(shouldAskForUsageType(OWN_FUNDS_TYPES.BANK_FORTUNE)).to.equal(false);
    });
  });

  describe('calculateRemainingFunds', () => {
    it('should return 0 if all is used up', () => {
      const structure = {
        ownFunds: [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 10 }],
      };
      const borrowers = [{ bankFortune: 10 }];
      expect(calculateRemainingFunds({
        type: OWN_FUNDS_TYPES.BANK_FORTUNE,
        structure,
        ownFundsIndex: -1,
        borrowers,
      })).to.equal(0);
    });
  });

  it('should return the remaining left over if any is', () => {
    const structure = {
      ownFunds: [{ type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5 }],
    };
    const borrowers = [{ insurance2: [{ value: 10 }] }];
    expect(calculateRemainingFunds({
      type: OWN_FUNDS_TYPES.INSURANCE_2,
      structure,
      ownFundsIndex: -1,
      borrowers,
    })).to.equal(5);
  });

  it('should not count the currently editing ownFunds object', () => {
    const structure = {
      ownFunds: [
        { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5 },
        { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5 }, // Being edited
      ],
    };
    const borrowers = [{ insurance2: [{ value: 10 }] }];
    expect(calculateRemainingFunds({
      type: OWN_FUNDS_TYPES.INSURANCE_2,
      structure,
      ownFundsIndex: 1,
      borrowers,
    })).to.equal(5);
  });

  it('should ignore all other ownFunds of different types', () => {
    const structure = {
      ownFunds: [
        { type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 5 },
        { type: OWN_FUNDS_TYPES.BANK_3A, value: 5 },
        { type: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE, value: 5 },
        { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5 },
      ],
    };
    const borrowers = [{ thirdPartyFortune: 10 }];
    expect(calculateRemainingFunds({
      type: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
      structure,
      ownFundsIndex: 1,
      borrowers,
    })).to.equal(5);
  });
});
