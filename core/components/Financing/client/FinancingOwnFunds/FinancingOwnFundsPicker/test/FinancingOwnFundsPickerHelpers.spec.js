// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import {
  chooseOwnFundsTypes,
  shouldAskForUsageType,
  calculateRemainingFunds,
  makeNewOwnFundsArray,
  getNewWantedLoanAfterPledge,
} from '../FinancingOwnFundsPickerHelpers';
import {
  RESIDENCE_TYPE,
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../../../api/constants';

describe('FinancingOwnFundsPickerHelpers', () => {
  describe('chooseOwnFundsTypes', () => {
    it('returns the right values for main', () => {
      expect(
        chooseOwnFundsTypes({
          loan: { residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE },
        }),
      ).to.deep.equal([
        OWN_FUNDS_TYPES.DONATION,
        OWN_FUNDS_TYPES.BANK_FORTUNE,
        OWN_FUNDS_TYPES.INSURANCE_3A,
        OWN_FUNDS_TYPES.BANK_3A,
        OWN_FUNDS_TYPES.INSURANCE_3B,
        OWN_FUNDS_TYPES.INSURANCE_2,
      ]);
    });

    it('returns the right values for secondary and investment', () => {
      const expected = [
        OWN_FUNDS_TYPES.DONATION,
        OWN_FUNDS_TYPES.BANK_FORTUNE,
        OWN_FUNDS_TYPES.INSURANCE_3B,
      ];

      expect(
        chooseOwnFundsTypes({
          loan: { residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE },
        }),
      ).to.deep.equal(expected);

      expect(
        chooseOwnFundsTypes({
          loan: { residenceType: RESIDENCE_TYPE.INVESTMENT },
        }),
      ).to.deep.equal(expected);
    });
  });

  describe('shouldAskForUsageType', () => {
    it('should return true for the right own funds types', () => {
      expect(shouldAskForUsageType(OWN_FUNDS_TYPES.INSURANCE_2)).to.equal(true);
    });

    it('should return false for the other own funds types', () => {
      expect(shouldAskForUsageType(OWN_FUNDS_TYPES.BANK_FORTUNE)).to.equal(
        false,
      );
    });
  });

  describe('calculateRemainingFunds', () => {
    it('returns undefined if no type is given', () => {
      expect(calculateRemainingFunds({})).to.equal(undefined);
    });

    it('should return 0 if all is used up', () => {
      const structure = {
        ownFunds: [
          { type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 10, borrowerId: 'id' },
        ],
      };
      const borrowers = [{ bankFortune: [{ value: 10 }], _id: 'id' }];
      expect(
        calculateRemainingFunds({
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          structure,
          ownFundsIndex: -1,
          borrowers,
          borrowerId: 'id',
        }),
      ).to.equal(0);
    });

    it('should return the remaining left over if any is', () => {
      const structure = {
        ownFunds: [
          { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5, borrowerId: 'id' },
        ],
      };
      const borrowers = [{ insurance2: [{ value: 10 }], _id: 'id' }];
      expect(
        calculateRemainingFunds({
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          structure,
          ownFundsIndex: -1,
          borrowers,
          borrowerId: 'id',
        }),
      ).to.equal(5);
    });

    it('should not count the currently editing ownFunds object', () => {
      const structure = {
        ownFunds: [
          { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5, borrowerId: 'id' },
          { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5, borrowerId: 'id' }, // Being edited
        ],
      };
      const borrowers = [{ insurance2: [{ value: 10 }], _id: 'id' }];
      expect(
        calculateRemainingFunds({
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          structure,
          ownFundsIndex: 1,
          borrowers,
          borrowerId: 'id',
        }),
      ).to.equal(5);
    });

    it('should ignore all other ownFunds of different types', () => {
      const structure = {
        ownFunds: [
          { type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 5, borrowerId: 'id' },
          { type: OWN_FUNDS_TYPES.BANK_3A, value: 5, borrowerId: 'id' },
          {
            type: OWN_FUNDS_TYPES.DONATION,
            value: 5,
            borrowerId: 'id',
          },
          { type: OWN_FUNDS_TYPES.INSURANCE_2, value: 5, borrowerId: 'id' },
        ],
      };
      const borrowers = [{ donation: [{ value: 10 }], _id: 'id' }];
      expect(
        calculateRemainingFunds({
          type: OWN_FUNDS_TYPES.DONATION,
          structure,
          ownFundsIndex: 1,
          borrowers,
          borrowerId: 'id',
        }),
      ).to.equal(5);
    });

    it('ignores ownFunds from other borrowers', () => {
      const structure = {
        ownFunds: [
          { type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 5, borrowerId: 'id2' },
        ],
      };
      const borrowers = [{ bankFortune: [{ value: 10 }], _id: 'id' }];
      expect(
        calculateRemainingFunds({
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          structure,
          ownFundsIndex: -1,
          borrowers,
          borrowerId: 'id',
        }),
      ).to.equal(10);
    });
  });

  describe('makeNewOwnFundsArray', () => {
    it('adds the new object in the array if it is empty', () => {
      const expected = [
        { type: 1, borrowerId: 3, value: 4, usageType: undefined },
      ];

      expect(
        makeNewOwnFundsArray({
          structure: { ownFunds: [] },
          ownFundsIndex: -1,
          ...expected[0],
        }),
      ).to.deep.equal(expected);
    });

    it('replaces the current object at index', () => {
      const expected = [
        { type: 1, borrowerId: 3, value: 4, usageType: undefined },
      ];

      expect(
        makeNewOwnFundsArray({
          structure: {
            ownFunds: [{ type: 5, borrowerId: 6, value: 7, usageType: 8 }],
          },
          ownFundsIndex: 0,
          ...expected[0],
        }),
      ).to.deep.equal(expected);
    });

    it('replaces the current object at larger index', () => {
      const expected = [
        { type: 5, borrowerId: 6, value: 7, usageType: 8 },
        { type: 9, borrowerId: 10, value: 11, usageType: 12 },
        { type: 1, borrowerId: 3, value: 4, usageType: undefined },
      ];

      expect(
        makeNewOwnFundsArray({
          structure: {
            ownFunds: [
              { type: 5, borrowerId: 6, value: 7, usageType: 8 },
              { type: 9, borrowerId: 10, value: 11, usageType: 12 },
              { type: 14, borrowerId: 15, value: 16, usageType: 17 },
            ],
          },
          ownFundsIndex: 2,
          ...expected[2],
        }),
      ).to.deep.equal(expected);
    });

    it('deletes object at index', () => {
      const expected = [
        { type: 5, borrowerId: 6, value: 7, usageType: 8 },
        { type: 14, borrowerId: 15, value: 16, usageType: 17 },
      ];

      expect(
        makeNewOwnFundsArray({
          structure: {
            ownFunds: [
              { type: 5, borrowerId: 6, value: 7, usageType: 8 },
              { type: 9, borrowerId: 10, value: 11, usageType: 12 },
              { type: 14, borrowerId: 15, value: 16, usageType: 17 },
            ],
          },
          ownFundsIndex: 1,
          shouldDelete: true,
          ...expected[2],
        }),
      ).to.deep.equal(expected);
    });

    it('deletes object if value is 0', () => {
      const expected = [
        { type: 5, borrowerId: 6, value: 7, usageType: 8 },
        { type: 14, borrowerId: 15, value: 16, usageType: 17 },
      ];

      expect(
        makeNewOwnFundsArray({
          structure: {
            ownFunds: [
              { type: 5, borrowerId: 6, value: 7, usageType: 8 },
              { type: 9, borrowerId: 10, value: 11, usageType: 12 },
              { type: 14, borrowerId: 15, value: 16, usageType: 17 },
            ],
          },
          ownFundsIndex: 1,
          value: 0,
        }),
      ).to.deep.equal(expected);
    });
  });

  describe('getNewWantedLoanAfterPledge', () => {
    it('returns the current wantedLoan if this is not a pledged value', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            structures: [{ wantedLoan: 100, id: 'struct' }],
          },
          structureId: 'struct',
          usageType: 'something else',
        }),
      ).to.equal(100);
    });

    it('returns wantedLoan plus a small pledge', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            structures: [
              {
                id: 'struct',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [],
                propertyWork: 0,
              },
            ],
          },
          structureId: 'struct',
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          value: 50000,
        }),
      ).to.equal(850000);
    });

    it('does not exceed maxBorrowRatioWithPledge', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            structures: [
              {
                id: 'struct',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [],
                propertyWork: 0,
              },
            ],
          },
          structureId: 'struct',
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          value: 150000,
        }),
      ).to.equal(900000);
    });

    it('does not exceed maxBorrowRatio if not a main residence', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            residenceType: RESIDENCE_TYPE.INVESTMENT,
            structures: [
              {
                id: 'struct',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [],
                propertyWork: 0,
              },
            ],
          },
          structureId: 'struct',
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          value: 150000,
        }),
      ).to.equal(800000);
    });

    it('counts other pledged own funds', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            structures: [
              {
                id: 'struct',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [
                  { value: 10000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
                ],
                propertyWork: 0,
              },
            ],
          },
          structureId: 'struct',
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          value: 50000,
          ownFundsIndex: -1,
        }),
      ).to.equal(860000);
    });

    it('reduces loan if pledge is reduced', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            structures: [
              {
                id: 'struct',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [
                  { value: 80000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
                ],
                propertyWork: 0,
              },
            ],
          },
          structureId: 'struct',
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          value: 40000,
          ownFundsIndex: 0,
        }),
      ).to.equal(840000);
    });

    it('increases loan if usageType is changed to pledge', () => {
      expect(
        getNewWantedLoanAfterPledge({
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            structures: [
              {
                id: 'struct',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [
                  { value: 80000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
                ],
                propertyWork: 0,
              },
            ],
          },
          structureId: 'struct',
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          value: 40000,
          ownFundsIndex: 0,
        }),
      ).to.equal(840000);
    });
  });
});
