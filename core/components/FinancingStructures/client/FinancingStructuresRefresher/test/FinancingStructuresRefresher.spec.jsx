// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';
import { mount } from 'core/utils/testHelpers/enzyme';
import { lifecycle } from 'recompose';
import T from '../../../../Translation';
import DefaultFinancingStructuresRefresher, {
  FinancingStructuresRefresher,
} from '../FinancingStructuresRefresher';

const wait = (duration = 100) =>
  new Promise(resolve => setTimeout(resolve, duration));

describe('FinancingStructuresRefresher', () => {
  let props;
  let store;
  const component = () =>
    getMountedComponent({
      Component: DefaultFinancingStructuresRefresher,
      props,
      withStore: store,
    });

  beforeEach(() => {
    getMountedComponent.reset();

    props = { loanFromDB: {} };
    store = {
      financingStructures: {
        loan: {},
        properties: {},
        structures: {},
        borrowers: {},
      },
    };
  });

  afterEach(() => {
    getMountedComponent.reset();
  });

  it('displays null by default', () => {
    expect(component()
      .find(FinancingStructuresRefresher)
      .instance()).to.equal(null);
  });

  it('shows the refresher if data is different before the timeout', () => {
    props.timeout = 50;
    props.loanFromDB = {};
    store.financingStructures.loan = { hello: 'world' };

    component();

    component().setProps({
      yo: 'dude',
      // loanFromDB: { hello: 'world' },
    });
    component().update();

    return wait(40).then(() => {
      component().update();
      expect(component()
        .find(FinancingStructuresRefresher)
        .instance()).to.equal(null);
    });
  });

  // TODO: Fix me
  it.skip('shows the refresher if data is different after the timeout', () => {
    props.timeout = 50;
    props.loanFromDB = {};
    store.financingStructures.loan = { hello: 'world' };

    component().setProps({
      loanFromDB: { hello: 'world' },
    });
    component().update();

    return wait(60).then(() => {
      component().update();
      expect(component()
        .find(T)
        .props().id).to.equal('FinancingStructuresRefresher.label');
    });
  });

  it('does not show the refresher if the data has not changed ', () => {
    props.timeout = 50;
    props.loanFromDB = { hello: 'world' };
    store.financingStructures.loan = { hello: 'world' };

    const wrapper = component();

    component().setProps({
      loanFromDB: { hello: 'world' },
    });

    return wait(60).then(() => {
      component().update();
      expect(component()
        .find(FinancingStructuresRefresher)
        .instance()).to.equal(null);
    });
  });
});
