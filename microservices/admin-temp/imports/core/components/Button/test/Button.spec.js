/* eslint-env mocha */
import React from 'react';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { expect } from 'chai';

import Button from 'core/components/Button';

describe('Button', () => {
  // Label removes testing warnings
  const wrapper = props => shallow(<Button label="test" {...props} />);

  it('renders', () => {
    expect(wrapper().exists()).to.equal(true);
  });
});
