// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { calculateMissingOwnFunds } from '../ownFundsHelpers';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/constants';

describe('ownFundsHelpers', () => {
  describe('calculateMissingOwnFunds', () => {
    it('returns a standard amount', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [],
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {},
        borrowers: [{}],
      })).to.equal(250000);
    });

    it('overrides notaryFees if provided', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [],
          notaryFees: 0,
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {},
        borrowers: [{}],
      })).to.equal(200000);
    });

    it('uses property work', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 100000,
          ownFunds: [],
        },
        properties: [{ _id: 'propertyId', value: 900000 }],
        loan: {},
        borrowers: [{}],
      })).to.equal(250000);
    });

    it('subtracts used own funds', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [{ value: 100000 }],
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {},
        borrowers: [{}],
      })).to.equal(150000);
    });

    it('does not count pledge as own funds', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [
            { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
            { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
          ],
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {},
        borrowers: [{}],
      })).to.equal(150000);
    });
  });
});
