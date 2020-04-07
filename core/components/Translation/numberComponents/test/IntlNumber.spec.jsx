/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { FormattedNumber } from 'react-intl';

import { shallow } from '../../../../utils/testHelpers/index';
import IntlNumber from '../IntlNumber';

describe('IntlNumber', () => {
  let props;
  const component = () => shallow(<IntlNumber {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('should render FormattedNumber for a regular number', () => {
    props.value = 10000;
    expect(component().find(FormattedNumber).length).to.equal(1);
  });

  it('does not render a dash for a normal number', () => {
    props.value = 10000;
    expect(component().equals('-')).to.equal(false);
  });

  it('should render FormattedNumber for 0', () => {
    props.value = 0;
    expect(component().find(FormattedNumber).length).to.equal(1);
  });

  it('should render a dash for falsy values', () => {
    props.value = undefined;
    expect(component().equals('-')).to.equal(true);
    props.value = false;
    expect(component().equals('-')).to.equal(true);
    props.value = null;
    expect(component().equals('-')).to.equal(true);
    props.value = NaN;
    expect(component().equals('-')).to.equal(true);
  });

  it('should render a dash for + and - Infinity', () => {
    props.value = Number.Infinity;
    expect(component().equals('-')).to.equal(true);
    props.value = -Number.Infinity;
    expect(component().equals('-')).to.equal(true);
  });

  it('renders the value if it is not a number', () => {
    props.value = 'hello world';
    expect(component().equals('hello world')).to.equal(true);
  });
});
