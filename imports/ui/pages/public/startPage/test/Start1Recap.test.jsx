import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';

import Start1Recap from '../Start1Recap.jsx';
import Recap from '/imports/ui/components/general/Recap.jsx';

describe('Start1Recap', () => {
  it('renders without props', () => {
    const wrapper = shallow(<Start1Recap />);

    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find(Recap).exists()).to.be.false;
  });

  it('renders with props', () => {
    const wrapper = shallow(
      <Start1Recap
        income={100}
        property={100}
        fortune={20}
        borrowRatio={0.7}
        incomeRatio={0.2}
      />,
    );

    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find(Recap).exists()).to.be.true;
  });
});
