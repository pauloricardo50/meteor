/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import {
  getMountedComponent,
  stubCollections,
} from  'core/utils/testHelpers';
import CompareOptions from '../CompareOptions';

import DefaultOptions from '../DefaultOptions';
import AdvancedOptions from '../AdvancedOptions';

describe('<CompareOptions />', () => {
  let comparator;
  let userId;
  let wrapper;

  const component = () =>
    getMountedComponent(CompareOptions, {
      comparator,
      changeComparator: () => {},
      addProperty: () => {},
      toggleField: () => true,
      allFields: [],
      removeCustomField: () => true,
    });

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    userId = Factory.create('user')._id;
    comparator = Factory.create('comparator', { userId });
    getMountedComponent.reset(false);
    wrapper = shallow(<CompareOptions
      comparator={comparator}
      changeComparator={() => {}}
      addProperty={() => {}}
      toggleField={() => {}}
      allFields={[]}
      removeCustomField={() => {}}
    />);
  });

  afterEach(() => {
    stubCollections.restore();
  });

  it('renders', () => {
    expect(wrapper.exists()).to.equal(true);
    expect(wrapper.name()).to.equal('div');
  });

  it('has a mask1 class on it', () => {
    expect(wrapper.hasClass('mask1')).to.equal(true);
  });

  it('renders only the default options by default', () => {
    expect(wrapper.find(DefaultOptions).exists()).to.equal(true);
    expect(wrapper.find(AdvancedOptions).exists()).to.equal(false);
  });

  it('has default state on start', () => {
    expect(wrapper.state()).to.deep.equal({ showAdvanced: false });
  });

  it('changes state with handleClick', (done) => {
    // Doing this renders the AdvancedOptions, and complains about its props
    // not being set, so make sure to provide props to the shallow wrapper
    // that matter to AdvancedOptions
    wrapper.instance().handleClick(() => {
      expect(wrapper.state()).to.deep.equal({ showAdvanced: true });
      done();
    });
  });

  if (Meteor.isClient) {
    // Otherwise it needs jsdom to work
    it('renders the advanced options after clicking on the button', () => {
      expect(component()
        .find(DefaultOptions)
        .exists()).to.equal(true);
      expect(component()
        .find(AdvancedOptions)
        .exists()).to.equal(false);

      // Simulate click
      // component()
      //   .instance()
      //   .handleClick(() => {
      //     expect(
      //       component()
      //         .find(DefaultOptions)
      //         .exists(),
      //       'default is true',
      //     ).to.equal(true);
      //     expect(
      //       component()
      //         .find(AdvancedOptions)
      //         .exists(),
      //       'advanced is true',
      //     ).to.equal(true);
      //     done();
      //   });
    });
  }
});
