/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import Start1Recap from '../Start1Recap';
import Recap from 'core/components/Recap';

describe('Start1Recap', () => {
  it('renders without props', () => {
    const wrapper = shallow(<Start1Recap />);

    expect(wrapper.exists()).to.equal(true);
    expect(wrapper.find(Recap).exists()).to.equal(false);
  });

  it('renders with props', () => {
    const wrapper = shallow(<Start1Recap
      income={100}
      property={100}
      fortune={20}
      borrowRatio={0.7}
      incomeRatio={0.2}
    />);

    expect(wrapper.exists()).to.equal(true);
    expect(wrapper.find(Recap).exists()).to.equal(true);
  });
});
