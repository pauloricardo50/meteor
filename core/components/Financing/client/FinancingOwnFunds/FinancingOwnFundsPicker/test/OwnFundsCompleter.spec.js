/* eslint-env mocha */
import { expect } from 'chai';

import { RESIDENCE_TYPE } from 'core/api/constants';
import { getRequiredAndCurrentFunds } from '../OwnFundsCompleterContainer';
import {
  OWN_FUNDS_USAGE_TYPES,
  OWN_FUNDS_TYPES,
} from '../../../../../../api/constants';

describe('OwnFundsCompleter', () => {
  describe('getRequiredAndCurrentFunds', () => {
    let props;
    let structure;
    let property;

    beforeEach(() => {
      props = {};
    });

    context('for an initial structure', () => {
      beforeEach(() => {
        structure = {
          id: 'struct1',
          ownFunds: [],
          propertyId: 'propertyId',
          wantedLoan: 800000,
          propertyWork: 0,
        };
        property = { _id: 'propertyId', value: 1000000 };
        props = {
          structure,
          structureId: 'struct1',
          properties: [property],
          loan: {
            properties: [property],
            residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            structures: [structure],
          },
          ownFundsIndex: -1,
          value: 0,
        };
      });

      it('returns 0 and standard value for a normal structure', () => {
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 0,
        });
      });

      it('returns less when a value is entered', () => {
        props.value = 100000;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 100000,
        });
      });

      it('properly discounts an existing ownFunds value', () => {
        structure.ownFunds = [{ value: 150000 }];
        props.ownFundsIndex = 0;
        props.value = 100000;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 100000,
        });
      });

      it('counts other values', () => {
        structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
        ];
        props.ownFundsIndex = -1;
        props.value = 100000;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 250000,
        });
      });

      it('counts other values, even if value is undefined', () => {
        structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
        ];
        props.ownFundsIndex = -1;
        props.value = undefined;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 150000,
        });
      });

      it('does not count other pledged values', () => {
        structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
        ];
        props.ownFundsIndex = -1;
        props.value = 100000;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 100000,
        });
      });

      it('adjusts the required ownFunds amount if you pledge a value', () => {
        props.ownFundsIndex = -1;
        props.value = 100000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 0,
        });
      });

      it('adjusts the required amount without exceeding maxBorrowRatioWithPledge', () => {
        // FIXME: Debate to be had:
        // 1. Do we reduce the pledged amount to 100k
        // 2. Do we let the pledged amount at 150k, which is a valid structure
        // But probably not what the user wants
        // Except if he's planning to modify another ownfunds afterwards

        // We chose Nb. 2, which is the simpler and more intuitive way to go

        structure.ownFunds = [{ value: 150000 }];
        props.ownFundsIndex = -1;
        props.value = 150000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 150000,
        });
      });

      it('takes into account previously pledged values', () => {
        structure.ownFunds = [
          { value: 40000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
          { value: 150000 },
        ];
        props.ownFundsIndex = -1;
        props.value = 40000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 170000,
          current: 150000,
        });
      });

      it('works if changing a wrong pledged amount', () => {
        structure.wantedLoan = 900000;
        structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
        ];
        props.ownFundsIndex = 0;
        props.value = 100000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 0,
        });
      });

      // Show warning instead
      it.skip('works if adding a wrong pledged amount twice', () => {
        structure.wantedLoan = 900000;
        structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
        ];
        props.ownFundsIndex = -1;
        props.value = 200000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 0,
        });
      });

      it('takes into account previously pledged values without exceeding maxBorrowRatioWithPledge 1', () => {
        structure.ownFunds = [
          { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
          { value: 150000 },
        ];
        props.ownFundsIndex = -1;
        props.value = 40000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 150000,
        });
      });

      it('takes into account previously pledged values without exceeding maxBorrowRatioWithPledge 2', () => {
        structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
          { value: 150000 },
        ];
        props.ownFundsIndex = -1;
        props.value = 40000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 150000,
        });
      });

      it('increases the wantedLoan only by the amount possible', () => {
        structure.wantedLoan = 600000;
        structure.ownFunds = [{ value: 150000 }];
        props.value = 300000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 350000,
          current: 150000,
        });
      });

      it('works when editing a pledge funds with high loan', () => {
        structure.wantedLoan = 900000;
        structure.ownFunds = [
          {
            value: 120000,
            type: OWN_FUNDS_TYPES.BANK_FORTUNE,
            borrowerId: 'bId',
          },
          {
            value: 100000,
            type: OWN_FUNDS_TYPES.INSURANCE_2,
            usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
            borrowerId: 'bId',
          },
          {
            value: 30000,
            type: OWN_FUNDS_TYPES.DONATION,
            borrowerId: 'bId',
          },
        ];
        props.ownFundsIndex = 1;
        props.value = 100000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        props.borrowers = [{ _id: 'bId' }];

        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 150000,
        });
      });

      it('works when changing withdraw to pledge', () => {
        property.value = 500000;
        structure.wantedLoan = 400000;
        structure.ownFunds = [
          {
            value: 75000,
            type: OWN_FUNDS_TYPES.BANK_FORTUNE,
            borrowerId: 'bId',
          },
          {
            value: 50000,
            type: OWN_FUNDS_TYPES.INSURANCE_2,
            usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
            borrowerId: 'bId',
          },
        ];
        props.ownFundsIndex = 1;
        props.value = 50000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        props.borrowers = [{ _id: 'bId' }];

        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 75000,
          current: 75000,
        });
      });

      it('works when changing pledge to withdraw', () => {
        property.value = 500000;
        structure.wantedLoan = 450000;
        structure.ownFunds = [
          {
            value: 75000,
            type: OWN_FUNDS_TYPES.BANK_FORTUNE,
            borrowerId: 'bId',
          },
          {
            value: 50000,
            type: OWN_FUNDS_TYPES.INSURANCE_2,
            usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
            borrowerId: 'bId',
          },
        ];
        props.ownFundsIndex = 1;
        props.type = OWN_FUNDS_TYPES.INSURANCE_2;
        props.value = 50000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.WITHDRAW;
        props.borrowers = [{ _id: 'bId' }];

        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 125000,
          current: 125000,
        });
      });
    });
  });
});
