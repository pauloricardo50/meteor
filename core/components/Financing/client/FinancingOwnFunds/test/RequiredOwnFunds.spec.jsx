/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../../config/financeConstants';
import { Calculator } from '../../../../../utils/Calculator';
import { shallow } from '../../../../../utils/testHelpers/enzyme';
import RequiredOwnFundsBody from '../RequiredOwnFundsBody';

describe('RequiredOwnFunds', () => {
  let props;
  const component = () => shallow(<RequiredOwnFundsBody {...props} />);

  beforeEach(() => {
    props = {
      value: 0,
      loan: { offers: [], structures: [] },
      Calculator: new Calculator({}),
    };
  });

  it('displays valid text when value is 0', () => {
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('valid');
  });

  it('shows valid when value is rounding amount', () => {
    props.value = OWN_FUNDS_ROUNDING_AMOUNT;
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('valid');
  });

  it('shows valid when value is negative rounding amount', () => {
    props.value = -OWN_FUNDS_ROUNDING_AMOUNT;
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('valid');
  });

  it('shows too low allocated own funds if value is high', () => {
    props.value = OWN_FUNDS_ROUNDING_AMOUNT + 1000;
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('low');
  });

  it('shows too much allocated own funds if value is high', () => {
    props.value = -OWN_FUNDS_ROUNDING_AMOUNT - 1000;
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('high');
  });

  it('shows valid when value is -rounding plus a sub-1 amount', () => {
    props.value = -OWN_FUNDS_ROUNDING_AMOUNT + 0.5;
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('valid');
  });

  it('shows valid when value is rounding minus a sub-1 amount', () => {
    props.value = OWN_FUNDS_ROUNDING_AMOUNT - 0.5;
    expect(
      component()
        .find('.text')
        .children()
        .first()
        .props().id,
    ).to.include('valid');
  });
});
