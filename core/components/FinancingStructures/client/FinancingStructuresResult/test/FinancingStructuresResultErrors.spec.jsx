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
      fortuneUsed: 0,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
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
      fortuneUsed: 50000,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };
    expect(component()
      .find(T)
      .props().id).to.contain('tooMuchOwnFunds');
  });

  it('warns of a high income ratio', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      fortuneUsed: 25000,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };

    expect(component()
      .find(T)
      .props().id).to.contain('highIncomeRatio');
  });

  it('warns of missing cash', () => {
    props.structure = {
      ...props.structure,
      propertyWork: 0,
      fortuneUsed: 12000,
      thirdPartyFortuneUsed: 0,
      secondPillarWithdrawal: 13000,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
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
      fortuneUsed: 25000,
      secondPillarWithdrawal: 0,
      secondPillarPledged: 0,
      thirdPillarWithdrawal: 0,
      thirdPillarPledged: 0,
    };
    props.borrowers = [{ salary: 100000 }];
    expect(component()
      .find(FinancingStructuresResultChart)
      .exists()).to.equal(true);
  });
});
