// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { calculateMissingOwnFunds } from '../ownFundsHelpers';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/constants';

describe('ownFundsHelpers', () => {
  describe('calculateMissingOwnFunds', () => {
    it('returns a standard amount', () => {
      expect(calculateMissingOwnFunds({
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {
          properties: [{ _id: 'propertyId', value: 1000000 }],
          structures: [
            {
              id: 'struct1',
              wantedLoan: 800000,
              propertyId: 'propertyId',
              propertyWork: 0,
              ownFunds: [],
            },
          ],
          borrowers: [{}],
        },
        structureId: 'struct1',
        structure: {
          id: 'struct1',
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [],
        },
      })).to.equal(250000);
    });

    it('overrides notaryFees if provided', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          id: 'struct1',
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [],
          notaryFees: 0,
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {
          properties: [{ _id: 'propertyId', value: 1000000 }],
          structures: [
            {
              id: 'struct1',
              wantedLoan: 800000,
              propertyId: 'propertyId',
              propertyWork: 0,
              ownFunds: [],
              notaryFees: 0,
            },
          ],
        },
        borrowers: [{}],
        structureId: 'struct1',
      })).to.equal(200000);
    });

    it('uses property work', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          id: 'struct1',
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 100000,
          ownFunds: [],
        },
        properties: [{ _id: 'propertyId', value: 900000 }],
        loan: {
          properties: [{ _id: 'propertyId', value: 900000 }],
          structures: [
            {
              id: 'struct1',
              wantedLoan: 800000,
              propertyId: 'propertyId',
              propertyWork: 100000,
              ownFunds: [],
            },
          ],
          borrowers: [{}],
        },
        structureId: 'struct1',
      })).to.equal(245000);
    });

    it('subtracts used own funds', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          id: 'struct1',
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [{ value: 100000 }],
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {
          properties: [{ _id: 'propertyId', value: 1000000 }],
          structures: [
            {
              id: 'struct1',
              wantedLoan: 800000,
              propertyId: 'propertyId',
              propertyWork: 0,
              ownFunds: [{ value: 100000 }],
            },
          ],
        },
        borrowers: [{}],
        structureId: 'struct1',
      })).to.equal(150000);
    });

    it('does not count pledge as own funds', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          id: 'struct1',
          wantedLoan: 800000,
          propertyId: 'propertyId',
          propertyWork: 0,
          ownFunds: [
            { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
            { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
          ],
        },
        properties: [{ _id: 'propertyId', value: 1000000 }],
        loan: {
          properties: [{ _id: 'propertyId', value: 1000000 }],
          structures: [
            {
              id: 'struct1',
              wantedLoan: 800000,
              propertyId: 'propertyId',
              propertyWork: 0,
              ownFunds: [
                { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
                { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
              ],
            },
          ],
        },
        borrowers: [{}],
        structureId: 'struct1',
      })).to.equal(150000);
    });

    it('uses calculated notary fees and rounds them', () => {
      expect(calculateMissingOwnFunds({
        structure: {
          id: 'struct1',
          wantedLoan: 1179750,
          propertyId: 'propertyId',
          propertyWork: 165000,
          ownFunds: [],
        },
        properties: [{ _id: 'propertyId', value: 1650000, canton: 'GE' }],
        loan: {
          properties: [{ _id: 'propertyId', value: 1650000, canton: 'GE' }],
          structures: [
            {
              id: 'struct1',
              wantedLoan: 1179750,
              propertyId: 'propertyId',
              propertyWork: 165000,
              ownFunds: [],
            },
          ],
          borrowers: [{}],
        },
        structureId: 'struct1',
      })).to.equal(720848);
    });
  });
});
