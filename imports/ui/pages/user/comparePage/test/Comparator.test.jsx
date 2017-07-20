import React from 'react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';
import { Factory } from 'meteor/dburles:factory';

import Comparator from '../Comparator.jsx';
import CompareTable from '../CompareTable.jsx';
import CompareOptions from '../CompareOptions.jsx';

describe('<Comparator />', () => {
  let comparator;
  let properties;
  let wrapper;

  beforeEach(() => {
    comparator = Factory.create('comparator');
    properties = [Factory.create('property')];
    wrapper = shallow(
      <Comparator comparator={comparator} properties={properties} />,
    );
  });

  it('renders', () => {
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.name()).to.equal('section');
  });

  it('has a comparator class', () => {
    expect(wrapper.hasClass('comparator')).to.be.true;
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
