/* eslint-env mocha */
import { expect } from 'chai';

import { mapStateToProps } from '../Widget1PageContainer';
import { widget1Constants } from '../../../../redux/widget1';

describe('Widget1PageContainer', () => {
  let state;

  beforeEach(() => {
    state = {
      widget1: {
        salary: {},
        fortune: {},
        property: {},
        wantedLoan: {},
        purchaseType: widget1Constants.PURCHASE_TYPE.ACQUISITION,
      },
    };
  });

  it('returns 0 for everything if incomeRatio is not set', () => {
    state.widget1.fortune.value = 25;
    state.widget1.property.value = 100;
    expect(mapStateToProps(state).finma.borrowRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.finmaMonthlyCost).to.equal(0);
  });

  it('returns 0 for everything if borrowRatio is not set', () => {
    state.widget1.fortune.value = 25;
    state.widget1.salary.value = 40;
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.finmaMonthlyCost).to.equal(0);
  });

  it('returns 0 for everything if borrowRatio is infinite', () => {
    state.widget1.fortune.value = 25;
    state.widget1.salary.value = 40;
    state.widget1.property.value = 0;
    expect(mapStateToProps(state).finma.borrowRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.finmaMonthlyCost).to.equal(0);
  });

  it('returns 0 for everything if incomeRatio is infinite', () => {
    state.widget1.fortune.value = 25;
    state.widget1.salary.value = 0;
    state.widget1.property.value = 100;
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0);
    expect(mapStateToProps(state).finma.finmaMonthlyCost).to.equal(0);
  });

  it('returns a borrowValue based on acquisition', () => {
    state.widget1.fortune.value = 25;
    state.widget1.salary.value = 1;
    state.widget1.property.value = 100;
    expect(mapStateToProps(state).finma.borrowRule.value).to.equal(0.8);
  });

  it('returns a borrowRatio based on refinancing', () => {
    state.widget1.wantedLoan.value = 80;
    state.widget1.salary.value = 1;
    state.widget1.property.value = 100;
    state.widget1.purchaseType = widget1Constants.PURCHASE_TYPE.REFINANCING;
    expect(mapStateToProps(state).finma.borrowRule.value).to.equal(0.8);
  });

  it('returns an incomeRatio based on acquisition', () => {
    state.widget1.fortune.value = 25;
    state.widget1.property.value = 100;
    state.widget1.salary.value = 40;
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0.15);
  });

  it('returns an incomeRatio based on acquisition', () => {
    state.widget1.wantedLoan.value = 80;
    state.widget1.property.value = 100;
    state.widget1.salary.value = 40;
    state.widget1.purchaseType = widget1Constants.PURCHASE_TYPE.REFINANCING;
    expect(mapStateToProps(state).finma.incomeRule.value).to.equal(0.15);
  });
});
