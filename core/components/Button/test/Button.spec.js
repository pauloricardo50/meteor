/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from '../../../utils/testHelpers/index';
import Button from '../Button';

describe('Button', () => {
  // Label removes testing warnings
  const wrapper = props => shallow(<Button label="test" {...props} />);

  it('renders', () => {
    expect(wrapper().exists()).to.equal(true);
  });
});
