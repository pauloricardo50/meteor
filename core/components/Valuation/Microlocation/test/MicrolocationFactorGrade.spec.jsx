// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import T from 'core/components/Translation';

import MicrolocationFactorGrade from '../MicrolocationFactorGrade';

describe('MicrolocationFactorGrade', () => {
  let props;
  const component = () => shallow(<MicrolocationFactorGrade {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('renders label only if it is provided', () => {
    expect(component()
      .find(T)
      .exists()).to.equal(false);
    props.label = 'Test label';
    expect(component()
      .find(T)
      .exists()).to.equal(true);
  });

  it('renders text only if it is provided', () => {
    expect(component()
      .find('p')
      .exists()).to.equal(false);
    props.text = 'Test text';
    expect(component()
      .find('p')
      .exists()).to.equal(true);
    expect(component().contains('Test text')).to.equal(true);
  });
});
