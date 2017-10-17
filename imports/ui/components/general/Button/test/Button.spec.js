/* eslint-env mocha */
import React from 'react';
import { shallow } from '/imports/js/helpers/testHelpers/enzyme';
import { expect } from 'chai';

import Button from '../Button';

describe('Button', () => {
  // Label removes testing warnings
  const wrapper = props => shallow(<Button label="test" {...props} />);

  it('renders', () => {
    expect(wrapper().exists()).to.equal(true);
  });
});
