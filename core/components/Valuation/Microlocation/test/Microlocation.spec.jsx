// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import Microlocation from '../Microlocation';
import MicrolocationFactor from '../MicrolocationFactor';

describe('Microlocation', () => {
  let props;
  const component = () => shallow(<Microlocation {...props} />);

  beforeEach(() => {
    props = { microlocation: { grade: 5, factors: {} } };
  });

  it('renders', () => {
    expect(component()
      .find('.microlocation')
      .exists()).to.equal(true);
  });

  it('displays as many factors as there are keys in factors', () => {
    props.microlocation.factors = { factor1: {}, factor2: {}, factor3: {} };
    expect(component().find(MicrolocationFactor)).to.have.length(3);
  });
});
