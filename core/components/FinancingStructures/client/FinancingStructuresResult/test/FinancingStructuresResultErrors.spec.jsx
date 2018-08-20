// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import T from 'core/components/Translation';
import { FinancingStructuresResultErrors } from '../FinancingStructuresResultErrors';
import FinancingStructuresResultChart from '../FinancingStructuresResultChart';

describe('FinancingStructuresResultErrors', () => {
  let props;
  let property;
  let propertyId;
  const component = () =>
    shallow(<FinancingStructuresResultErrors {...props} />);

  beforeEach(() => {
    propertyId = 'property';
    property = { _id: propertyId, value: 100 };
    props = {
      structure: { propertyId, wantedLoan: 80, property },
      properties: [property],
      loan: {},
    };
  });

  it('warns if no mortgage loan exists', () => {
    props.structure = { ...props.structure, wantedLoan: 0 };
    expect(component()
      .find(T)
      .props()
      .id.includes('noMortgageLoan')).to.equal(true);

    props.structure = { ...props.structure, wantedLoan: undefined };
    expect(component()
      .find(T)
      .props()
      .id.includes('noMortgageLoan')).to.equal(true);
  });

  it('warns of missing own funds', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      fortuneUsed: 0,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };
    expect(component()
      .find(T)
      .props()
      .id.includes('missingOwnFunds')).to.equal(true);
  });

  it('warns of missing own funds if the value is NaN', () => {
    expect(component()
      .find(T)
      .props()
      .id.includes('missingOwnFunds')).to.equal(true);
  });

  it('warns of too much own funds', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      fortuneUsed: 50,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };
    expect(component()
      .find(T)
      .props()
      .id.includes('tooMuchOwnFunds')).to.equal(true);
  });

  it('warns of a high income ratio', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      fortuneUsed: 25,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };

    expect(component()
      .find(T)
      .props()
      .id.includes('highIncomeRatio')).to.equal(true);
  });

  it('returns null if no error exists in the structure', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      fortuneUsed: 25,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };
    props.borrowers = [{ salary: 1000 }];
    expect(component().find(FinancingStructuresResultChart).exists()).to.equal(true);
  });
});
