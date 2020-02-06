/* eslint-env mocha */
import { expect } from 'chai';

import { Calculator } from '..';
import { LENDER_RULES_VARIABLES } from '../../../api/constants';

describe('LenderRulesInitializator', () => {
  let loan;
  let lenderRules;
  let structure;
  let property;

  beforeEach(() => {
    property = {
      _id: 'propertyId',
      value: 120000,
    };
    structure = {
      id: 'selectedStructure',
      propertyId: 'propertyId',
      property,
    };
    loan = {
      structures: [structure],
      properties: [property],
      selectedStructure: 'selectedStructure',
    };
    lenderRules = [];
  });

  it('does not initialize if no lenderRules are passed in the constructor', () => {
    const calc = new Calculator({});
    expect(calc.maxBorrowRatio).to.equal(0.8);
  });

  it('changes the rules based on the selected structure', () => {
    lenderRules = [
      {
        filter: {
          and: [
            { '>': [{ var: LENDER_RULES_VARIABLES.PROPERTY_VALUE }, 100000] },
          ],
        },
        maxBorrowRatio: 0.7,
      },
    ];
    const calc = new Calculator({ loan, lenderRules });
    expect(calc.maxBorrowRatio).to.equal(0.7);

    property.value = 90000;
    const calc2 = new Calculator({ loan, lenderRules });
    expect(calc2.maxBorrowRatio).to.equal(0.8);
  });

  // TODO
  it.skip('uses primary rules to match secondary rules', () => {
    lenderRules = [
      {
        filter: {
          and: [
            { '>': [{ var: LENDER_RULES_VARIABLES.PROPERTY_VALUE }, 100000] },
          ],
        },
        bonusConsideration: 1,
      },
      {
        filter: {
          and: [{ '<': [{ var: LENDER_RULES_VARIABLES.INCOME }, 0.5] }],
        },
        maxIncomeRatio: 0.39,
      },
    ];
  });

  it('merges rules in the right order', () => {
    lenderRules = [
      {
        filter: {
          and: [
            { '>': [{ var: LENDER_RULES_VARIABLES.PROPERTY_VALUE }, 100000] },
          ],
        },
        maxBorrowRatio: 0.7,
      },
      {
        filter: {
          and: [
            { '>': [{ var: LENDER_RULES_VARIABLES.PROPERTY_VALUE }, 110000] },
          ],
        },
        maxBorrowRatio: 0.6,
      },
    ];
    const calc = new Calculator({ loan, lenderRules });
    expect(calc.maxBorrowRatio).to.equal(0.6);
  });

  it('merges comments together', () => {
    lenderRules = [
      {
        filter: {
          and: [
            { '>': [{ var: LENDER_RULES_VARIABLES.PROPERTY_VALUE }, 100000] },
          ],
        },
        adminComments: ['a'],
      },
      {
        filter: {
          and: [
            { '>': [{ var: LENDER_RULES_VARIABLES.PROPERTY_VALUE }, 110000] },
          ],
        },
        adminComments: ['b'],
      },
    ];
    const calc = new Calculator({ loan, lenderRules });
    expect(calc.adminComments).to.deep.equal(['a', 'b']);
  });

  it('does not skip a rule if it is 0', () => {
    lenderRules = [{ filter: { and: [true] }, dividendsConsideration: 0 }];
    const calc = new Calculator({ loan, lenderRules });
    expect(calc.dividendsConsideration).to.equal(0);
  });

  it('skips undefined and null rules', () => {
    lenderRules = [
      { filter: { and: [true] }, dividendsConsideration: 0.5 },
      { filter: { and: [true] }, dividendsConsideration: undefined },
      { filter: { and: [true] }, dividendsConsideration: null },
    ];
    const calc = new Calculator({ loan, lenderRules });
    expect(calc.dividendsConsideration).to.equal(0.5);
  });
});
