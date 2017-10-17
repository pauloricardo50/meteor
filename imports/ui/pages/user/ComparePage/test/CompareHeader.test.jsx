/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from '/imports/js/helpers/testHelpers/enzyme';

import CompareHeader from '../CompareHeader';

describe('<CompareHeader />', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = {
      fields: [],
      handleSort: () => {},
      handleFilter: () => {},
      handleReset: () => {},
      addCustomField: () => {},
      onHoverEnter: () => {},
      onHoverLeave: () => {},
      scrollLeft: 0,
    };

    wrapper = (propz = {}) => shallow(<CompareHeader {...props} {...propz} />);
  });

  it('renders', () => {
    expect(wrapper().exists()).to.equal(true);
  });

  it('has a mask1 class', () => {
    expect(wrapper().hasClass('mask1')).to.equal(true);
  });

  it('renders a list with as many li as there are field props + 2 default ones', () => {
    expect(
      wrapper({ fields: [{ id: 'one' }, { id: 'two' }] }).find('li').length,
    ).to.equal(4);
  });
});
