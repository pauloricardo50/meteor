//
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import T from 'core/components/Translation';
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import { FinancingResultErrors } from '../FinancingResultErrors';
import FinancingResultChart from '../FinancingResultChart';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/constants';
import Calculator from '../../../../../utils/Calculator';

describe('FinancingResultErrors', () => {
  let props;
  let property;
  let propertyId;
  let structureId;
  let offer;
  let offerId;
  let structure;
  let borrower;
  const component = () => shallow(<FinancingResultErrors {...props} />);

  beforeEach(() => {
    propertyId = 'propertyId';
    structureId = 'structureId';
    offerId = 'offerId';
    property = { _id: propertyId, value: 100000 };
    offer = { _id: offerId, interest10: 0.01 };
    structure = {
      propertyId,
      wantedLoan: 80000,
      id: structureId,
      ownFunds: [],
      propertyWork: 0,
    };
    borrower = {};
    props = {
      loan: {
        properties: [property],
        structures: [structure],
        offers: [offer],
        borrowers: [borrower],
      },
      Calculator,
      structureId,
    };
  });

  it('warns if no mortgage loan exists', () => {
    structure.wantedLoan = 0;
    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('noMortgageLoan');

    structure.wantedLoan = undefined;
    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('noMortgageLoan');
  });

  it('warns of missing own funds', () => {
    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('missingOwnFunds');
  });

  it('warns of missing own funds if the value is NaN', () => {
    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('missingOwnFunds');
  });

  it('warns of too much own funds', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 50000 }];

    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('tooMuchOwnFunds');
  });

  it('warns of a high income ratio', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];

    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('highIncomeRatio');
  });

  it('warns of missing cash', () => {
    structure.ownFunds = [
      { type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 12000 },
      {
        type: OWN_FUNDS_TYPES.INSURANCE_2,
        value: 12000,
        usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
      },
    ];
    borrower.salary = 100000;

    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('missingCash');
  });

  it('warns of invalid interest rates', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];
    structure.offerId = offerId;
    structure.loanTranches = [{ type: 'interest5', value: 1 }];
    borrower.salary = 100000;

    expect(
      component()
        .find(T)
        .props().id,
    ).to.contain('invalidInterestRates');
  });

  it('returns null if no error exists in the structure', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];
    borrower.salary = 100000;
    expect(
      component()
        .find(FinancingResultChart)
        .exists(),
    ).to.equal(true);
  });
});
