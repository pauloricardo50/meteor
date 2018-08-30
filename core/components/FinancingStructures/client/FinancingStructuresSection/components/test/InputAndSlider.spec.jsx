// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'core/utils/testHelpers/enzyme';

import { InputAndSlider } from '../InputAndSlider';

describe('InputAndSlider', () => {
  let props;
  const component = () => mount(<InputAndSlider {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('allows undefined values', () => {
    props = {
      allowUndefined: true,
      handleChange: sinon.spy(),
    };
    const wrapper = component();
  });
});
