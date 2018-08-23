// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import Tabs from '../Tabs';

describe('Tabs', () => {
  let props;
  const component = () => shallow(<Tabs {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('test name', () => {
    // Test code
  });
});
