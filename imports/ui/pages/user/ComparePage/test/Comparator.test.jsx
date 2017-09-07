/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';

import Comparator from '../Comparator';
import CompareTable from '../CompareTable';
import CompareOptions from '../CompareOptions';

describe('<Comparator />', () => {
  let comparator;
  let properties;
  let wrapper;

  beforeEach(() => {
    stubCollections();
    comparator = Factory.create('comparator');
    properties = [Factory.create('property')];
    wrapper = shallow(
      <Comparator comparator={comparator} properties={properties} />,
    );
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

  it('keeps the name field at the top, even with custom fields', () => {
    const childWrapper = wrapper.find(CompareTable).dive();

    expect(childWrapper.instance().props.fields[0].id).to.equal('name');
  });

  it('renders CompareOptions and a CompareTable', () => {
    expect(wrapper.find(CompareOptions).length).to.equal(1);
    expect(wrapper.find(CompareTable).length).to.equal(1);
  });
});
