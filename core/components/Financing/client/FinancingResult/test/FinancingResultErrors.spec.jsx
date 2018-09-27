// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import T from 'core/components/Translation';
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import { FinancingResultErrors } from '../FinancingResultErrors';
import FinancingResultChart from '../FinancingResultChart';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/constants';

describe('FinancingResultErrors', () => {
  let props;
  let property;
  let propertyId;
  const component = () =>
    shallow(<FinancingResultErrors {...props} />);

  beforeEach(() => {
    propertyId = 'property';
    property = { _id: propertyId, value: 100000 };
    props = {
      structure: { propertyId, wantedLoan: 80000, property },
      properties: [property],
      loan: {},
    };
  });

  it('warns if no mortgage loan exists', () => {
    props.structure = { ...props.structure, wantedLoan: 0 };
    expect(component()
      .find(T)
      .props().id).to.contain('noMortgageLoan');

    props.structure = { ...props.structure, wantedLoan: undefined };
    expect(component()
      .find(T)
      .props().id).to.contain('noMortgageLoan');
  });

  it('warns of missing own funds', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      ownFunds: [],
    };
    expect(component()
      .find(T)
      .props().id).to.contain('missingOwnFunds');
  });

  it('warns of missing own funds if the value is NaN', () => {
    expect(component()
      .find(T)
      .props().id).to.contain('missingOwnFunds');
  });

  it('warns of too much own funds', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      ownFunds: [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 50000 }],
    };
    expect(component()
      .find(T)
      .props().id).to.contain('tooMuchOwnFunds');
  });

  it('warns of a high income ratio', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      ownFunds: [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }],
    };

    expect(component()
      .find(T)
      .props().id).to.contain('highIncomeRatio');
  });

  it('warns of missing cash', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      ownFunds: [
        { type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 12000 },
        {
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          value: 12000,
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
        },
      ],
    };
    props.borrowers = [{ salary: 100000 }];

    expect(component()
      .find(T)
      .props().id).to.contain('missingCash');
  });

  it('returns null if no error exists in the structure', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      ownFunds: [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 25000 }],
    };
    props.borrowers = [{ salary: 100000 }];
    expect(component()
      .find(FinancingResultChart)
      .exists()).to.equal(true);
  });
});
