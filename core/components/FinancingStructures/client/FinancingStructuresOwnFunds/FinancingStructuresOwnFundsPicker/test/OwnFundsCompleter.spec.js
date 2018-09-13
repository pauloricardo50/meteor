// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { RESIDENCE_TYPE } from 'core/api/constants';
import { getRequiredAndCurrentFunds } from '../OwnFundsCompleterContainer';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../../api/constants';

describe.only('OwnFundsCompleter', () => {
  describe('getRequiredAndCurrentFunds', () => {
    let props;

    beforeEach(() => {
      props = {};
    });

    context('for an initial structure', () => {
      beforeEach(() => {
        props = {
          structure: {
            ownFunds: [],
            propertyId: 'propertyId',
            wantedLoan: 800000,
            propertyWork: 0,
          },
          properties: [{ _id: 'propertyId', value: 1000000 }],
          loan: { general: { residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE } },
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
        props.structure.ownFunds = [{ value: 150000 }];
        props.ownFundsIndex = 0;
        props.value = 100000;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 100000,
        });
      });

      it('counts other values', () => {
        props.structure.ownFunds = [
          { value: 150000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
        ];
        props.ownFundsIndex = -1;
        props.value = 100000;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 250000,
          current: 250000,
        });
      });

      it('does not count other pledged values', () => {
        props.structure.ownFunds = [
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

        props.structure.ownFunds = [{ value: 150000 }];
        props.ownFundsIndex = -1;
        props.value = 150000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 150000,
          current: 150000,
        });
      });

      it('takes into account previously pledged values', () => {
        props.structure.ownFunds = [
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

      it('takes into account previously pledged values without exceeding maxBorrowRatioWithPledge', () => {
        props.structure.ownFunds = [
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

      it('takes into account previously pledged values without exceeding maxBorrowRatioWithPledge', () => {
        props.structure.ownFunds = [
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
        props.structure.wantedLoan = 600000;
        props.structure.ownFunds = [{ value: 150000 }];
        props.value = 300000;
        props.usageType = OWN_FUNDS_USAGE_TYPES.PLEDGE;
        expect(getRequiredAndCurrentFunds(props)).to.deep.equal({
          required: 350000,
          current: 150000,
        });
      });
    });
  });
});
