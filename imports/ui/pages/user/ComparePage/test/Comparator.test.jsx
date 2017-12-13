/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from '/imports/js/helpers/testHelpers/enzyme';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Comparator from '../Comparator';
import CompareTable from '../CompareTable';
import CompareOptions from '../CompareOptions';

describe('<Comparator />', () => {
  let userId;
  let comparator;
  let properties;
  let wrapper;

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    userId = Factory.create('user')._id;
    comparator = Factory.create('comparator', { userId });
    properties = [Factory.create('property', { userId })];
    console.log(properties);
    wrapper = shallow(<Comparator comparator={comparator} properties={properties} />);
  });

  afterEach(() => {
    stubCollections.restore();
  });

  it('renders', () => {
    expect(wrapper.exists()).to.equal(true);
    expect(wrapper.name()).to.equal('section');
  });

  it('has a comparator class', () => {
    expect(wrapper.hasClass('comparator')).to.equal(true);
  });

  // This test requires window to be defined
  if (Meteor.isClient) {
    it('keeps the name field at the top, even with custom fields', () => {
      const childWrapper = wrapper.find(CompareTable).dive();

      expect(childWrapper.instance().props.fields[0].id).to.equal('name');
    });
  }

  it('renders CompareOptions and a CompareTable', () => {
    expect(wrapper.find(CompareOptions).length).to.equal(1);
    expect(wrapper.find(CompareTable).length).to.equal(1);
  });
});
