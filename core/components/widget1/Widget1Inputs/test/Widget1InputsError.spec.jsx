/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import T from 'core/components/Translation';
import StatusIcon from 'core/components/StatusIcon';
import Widget1InputsError from '../Widget1InputsError';

describe('Widget1InputsError', () => {
  let props;
  const component = () => shallow(<Widget1InputsError {...props} />);

  beforeEach(() => {
    props = { borrowRule: {}, incomeRule: {} };
  });

  it('renders the tutorial if incomeRatio is not well defined', () => {
    props.borrowRule.value = 1;
    expect(
      component()
        .find(T)
        .props().id,
    ).to.include('empty');
  });

  it('renders the tutorial if borrowRatio is not well defined', () => {
    props.incomeRule.value = 1;
    expect(
      component()
        .find(T)
        .props().id,
    ).to.include('empty');
  });

  it('renders the worst of both status for error', () => {
    props.incomeRule = { value: 1, status: 'ERROR' };
    props.borrowRule = { value: 1, status: 'SUCCESS' };
    expect(
      component()
        .find(StatusIcon)
        .props().status,
    ).to.equal('ERROR');
    expect(
      component()
        .find(T)
        .props().id,
    ).to.include('income');
  });

  it('renders the worst of both status for warning', () => {
    props.incomeRule = { value: 1, status: 'WARNING' };
    props.borrowRule = { value: 1, status: 'SUCCESS' };
    expect(
      component()
        .find(StatusIcon)
        .props().status,
    ).to.equal('WARNING');
    expect(
      component()
        .find(T)
        .props().id,
    ).to.include('income');
  });

  it('renders the worst of both status for warning and error', () => {
    props.incomeRule = { value: 1, status: 'WARNING' };
    props.borrowRule = { value: 1, status: 'ERROR' };
    expect(
      component()
        .find(StatusIcon)
        .props().status,
    ).to.equal('ERROR');
    expect(
      component()
        .find(T)
        .props().id,
    ).to.include('borrow');
  });

  it('renders success if both are success', () => {
    props.incomeRule = { value: 1, status: 'SUCCESS' };
    props.borrowRule = { value: 1, status: 'SUCCESS' };
    expect(
      component()
        .find(StatusIcon)
        .props().status,
    ).to.equal('SUCCESS');
    expect(
      component()
        .find(T)
        .props().id,
    ).to.include('success');
  });
});
