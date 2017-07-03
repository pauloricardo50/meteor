import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';

import CompareHeader from '../CompareHeader.jsx';

describe('<CompareHeader />', () => {
  it('renders', () => {
    const wrapper = shallow(<CompareHeader fields={[]} />);

    expect(wrapper.exists()).to.be.true;
  });

  it('has a mask1 class', () => {
    const wrapper = shallow(<CompareHeader fields={[]} />);

    expect(wrapper.hasClass('mask1')).to.be.true;
  });

  it('renders a list with as many li as there are field props + 2 default ones', () => {
    const wrapper = shallow(
      <CompareHeader fields={[{ id: 'one' }, { id: 'two' }]} />,
    );

    expect(wrapper.find('li').length).to.equal(4);
  });
});
