// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import getMountedComponent from '../../../../../utils/testHelpers/getMountedComponent';

import LoanPercent from '../LoanPercent';
import { UPDATE_STRUCTURE } from '../../../../../redux/financing/index';

describe('LoanPercent', () => {
  let props;
  let store;
  const structureId = 'structureId';
  const propertyId = 'propertyId';
  const component = () =>
    getMountedComponent({
      Component: LoanPercent,
      props,
      withStore: store,
    });

  beforeEach(() => {
    props = { structureId };
    store = {
      financing: {
        structures: {
          [structureId]: {
            id: structureId,
            wantedLoan: 800000,
            propertyId,
            propertyWork: 0,
          },
        },
        properties: { [propertyId]: { _id: propertyId, value: 1000000 } },
        borrowers: {},
        loan: {},
      },
    };
  });

  afterEach(() => {
    getMountedComponent.reset();
  });

  it('initializes the input with the right percentage', () => {
    expect(component()
      .find('input')
      .parent()
      .props().value).to.equal('80.00');
  });

  it('sets the loan when typing a percentage', () => {
    component()
      .find('input')
      .simulate('change', { target: { value: '65' } });

    component().update();

    const { store: reduxStore } = getMountedComponent.getData();

    expect(reduxStore.getActions()).to.deep.equal([
      {
        type: UPDATE_STRUCTURE,
        payload: { structureId, structure: { wantedLoan: 650000 } },
      },
    ]);
  });

  it('rounds the wantedLoan', () => {
    store.financing.properties[propertyId].value = 567433;

    component()
      .find('input')
      .simulate('change', { target: { value: '65' } });

    component().update();

    const { store: reduxStore } = getMountedComponent.getData();

    expect(reduxStore.getActions()).to.deep.equal([
      {
        type: UPDATE_STRUCTURE,
        payload: { structureId, structure: { wantedLoan: 368831 } },
      },
    ]);
  });
});
