// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import NewLoanFormButtons from '../NewLoanFormButtons';
import { STEPS_ARRAY } from '../NewLoanFormContainer';

describe('NewLoanFormButtons', () => {
  let props;
  const component = () => shallow(<NewLoanFormButtons {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('renders next button only', () => {
    props.numberOfSteps = 3;
    props.step = 0;
    expect(component().find('#next').length).to.equal(1);
    expect(component().find('#previous').length).to.equal(0);
    expect(component().find('#submit').length).to.equal(0);
  });

  it('renders next and previous buttons only', () => {
    props.numberOfSteps = 3;
    props.step = 1;
    expect(component().find('#next').length).to.equal(1);
    expect(component().find('#previous').length).to.equal(1);
    expect(component().find('#submit').length).to.equal(0);
  });

  it('renders submit and previous buttons only', () => {
    props.numberOfSteps = 3;
    props.step = 2;
    expect(component().find('#next').length).to.equal(0);
    expect(component().find('#previous').length).to.equal(1);
    expect(component().find('#submit').length).to.equal(1);
  });

  it('does not enable next button when prop is not set', () => {
    props.numberOfSteps = 3;
    props.step = 0;
    props[STEPS_ARRAY[props.step]] = '';
    expect(
      component()
        .find('#next')
        .first()
        .props().disabled,
    ).to.equal(true);
  });

  it('enables next button when prop is set', () => {
    props.numberOfSteps = 3;
    props.step = 1;
    props[STEPS_ARRAY[props.step]] = 'test';
    expect(
      component()
        .find('#next')
        .first()
        .props().disabled,
    ).to.equal(false);
  });

  it('enables submit button when last prop is set', () => {
    props.numberOfSteps = 3;
    props.step = 2;
    props[STEPS_ARRAY[props.step]] = 'test';
    expect(
      component()
        .find('#submit')
        .first()
        .props().disabled,
    ).to.equal(false);
  });
});
