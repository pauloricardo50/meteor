/* eslint-env mocha */
import { expect } from 'chai';

import { OWN_FUNDS_TYPES } from '../../../../../api/borrowers/borrowerConstants';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/loans/loanConstants';
import Calculator from '../../../../../utils/Calculator';
import { getFinancingError } from '../FinancingResultErrors';

describe('FinancingResultErrors', () => {
  let props;
  let property;
  let propertyId;
  let structureId;
  let offer;
  let offerId;
  let structure;
  let borrower;

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
        borrowers: [borrower],
        lenders: [{ organisation: { name: 'Org' }, offers: [offer] }],
      },
      Calculator,
      structureId,
    };
  });

  it('warns if no mortgage loan exists', () => {
    structure.wantedLoan = 0;
    expect(getFinancingError(props).id).to.equal('noMortgageLoan');

    structure.wantedLoan = undefined;
    expect(getFinancingError(props).id).to.equal('noMortgageLoan');
  });

  it('warns of missing own funds', () => {
    expect(getFinancingError(props).id).to.equal('missingOwnFunds');
  });

  it('warns of missing own funds if the value is NaN', () => {
    expect(getFinancingError(props).id).to.equal('missingOwnFunds');
  });

  it('warns of too much own funds', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 50000 }];

    expect(getFinancingError(props).id).to.equal('tooMuchOwnFunds');
  });

  it('warns of a high income ratio', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];

    expect(getFinancingError(props).id).to.equal('highIncomeRatio');
  });

  it('warns of a tight income ratio only when necessary', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];
    borrower.salary = 17000; // ~35% incomeRatio

    expect(getFinancingError(props).id).to.equal('tightIncomeRatio');

    borrower.salary = 12000; // >40% incomeRatio
    expect(getFinancingError(props).id).to.equal('highIncomeRatio');
  });

  it('does not warn of tight income ratio when an offer is selected, but only highIncomeRatioWithOffer', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];
    borrower.salary = 17000; // ~35% incomeRatio
    structure.offerId = offerId;

    expect(getFinancingError(props).id).to.equal('highIncomeRatioWithOffer');
  });

  it('warns of a high borrowRatio', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 24000 }];
    borrower.salary = 20000;
    structure.wantedLoan = 81000;

    expect(getFinancingError(props).id).to.equal('highBorrowRatio');
  });

  it('warns of highBorrowRatioWithLender when an offer is chosen', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 24000 }];
    borrower.salary = 20000;
    structure.wantedLoan = 81000;

    structure.offerId = offerId;
    expect(getFinancingError(props).id).to.equal('highBorrowRatioWithLender');
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

    expect(getFinancingError(props).id).to.equal('missingCash');
  });

  it('warns of invalid interest rates', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];
    structure.offerId = offerId;
    structure.loanTranches = [{ type: 'interest5', value: 1 }];
    borrower.salary = 100000;

    expect(getFinancingError(props).id).to.equal('invalidInterestRates');
  });

  it('returns null if no error exists in the structure', () => {
    structure.ownFunds = [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }];
    borrower.salary = 100000;
    expect(getFinancingError(props).id).to.equal(undefined);
  });
});
