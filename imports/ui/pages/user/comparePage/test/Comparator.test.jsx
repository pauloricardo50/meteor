import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';

import Comparator from '../Comparator.jsx';
import CompareTable from '../CompareTable.jsx';
import CompareOptions from '../CompareOptions.jsx';

describe('<Comparator />', () => {
  it('renders', () => {
    const wrapper = shallow(<Comparator />);

    expect(wrapper.exists()).to.be.true;
    expect(wrapper.name()).to.equal('section');
  });

  it('has a comparator class', () => {
    const wrapper = shallow(<Comparator />);

    expect(wrapper.hasClass('comparator')).to.be.true;
  });

  it('has default options in its state', () => {
    const wrapper = shallow(<Comparator />);

    expect(wrapper.state()).to.deep.equal({
      useBorrowers: false,
      income: '',
      fortune: '',
      borrowRatio: 0.8,
    });
  });

  it('changes options when changeOptions is called', (done) => {
    const wrapper = shallow(<Comparator />);
    expect(typeof wrapper.instance().changeOptions).to.equal('function');
    wrapper.instance().changeOptions('income', 100000, () => {
      expect(wrapper.state('income')).to.equal(100000);
      done();
    });
  });

  it('renders CompareOptions and a CompareTable', () => {
    const wrapper = shallow(<Comparator />);

    expect(wrapper.find(CompareOptions).length).to.equal(1);
    expect(wrapper.find(CompareTable).length).to.equal(1);
  });
});
