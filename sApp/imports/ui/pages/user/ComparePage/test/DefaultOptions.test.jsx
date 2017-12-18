/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from '/imports/js/helpers/testHelpers/enzyme';
import { spy } from 'sinon';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import {
  getMountedComponent,
  stubCollections,
} from '/imports/js/helpers/testHelpers';

import TextInput from 'core/components/TextInput';
import DefaultOptions from '../DefaultOptions';
import BorrowerOptions from '../BorrowerOptions';

describe('<DefaultOptions />', () => {
  let comparator;
  let userId;
  let wrapper;

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    getMountedComponent.reset(false);

    userId = Factory.create('user')._id;
    comparator = Factory.create('comparator', { userId });

    wrapper = shallow(<DefaultOptions comparator={comparator} changeComparator={() => {}} />);
  });

  afterEach(() => {
    stubCollections.restore();
  });

  it('renders', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it("doesn't render BorrowerOptions if the prop use Borrowers is false", () => {
    expect(wrapper.find(BorrowerOptions).exists()).to.equal(false);
  });

  it('renders 3 TextInput', () => {
    expect(wrapper.find(TextInput).length).to.equal(3);
  });

  if (Meteor.isClient) {
    it('mounts without errors', () => {
      const mounted = getMountedComponent(DefaultOptions, {
        comparator: { income: 0, fortune: 0 },
        changeComparator: () => {},
      });

      expect(mounted.exists()).to.equal(true);
    });

    it('calls onChange after an input', () => {
      const handleChangeSpy = spy();
      const mounted = getMountedComponent(DefaultOptions, {
        comparator: { income: 0, fortune: 0 },
        changeComparator: handleChangeSpy,
      });
      const firstInput = mounted.find('input').first();

      expect(firstInput.exists()).to.equal(true);
      expect(mounted.props('changeOptions')).to.not.equal(undefined);

      firstInput.simulate('input', { key: 'a', keyCode: 65, which: 65 });

      expect(handleChangeSpy.calledOnce).to.equal(true);
    });
  }
});
