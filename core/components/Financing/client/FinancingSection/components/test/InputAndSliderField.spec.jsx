// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'core/utils/testHelpers/enzyme';

import { InputAndSliderField } from '../InputAndSliderField';
import MoneyInput from '../../../../../MoneyInput';
import Slider from '../../../../../Slider';

describe('InputAndSliderField', () => {
  let props;
  const component = () => mount(<InputAndSliderField {...props} />);

  const inputValue = wrapper => wrapper.find(MoneyInput).props().value;
  const sliderValue = wrapper => wrapper.find(Slider).props().value;

  beforeEach(() => {
    props = {};
  });

  it('allows undefined values', () => {
    props = {
      allowUndefined: true,
      value: 12,
    };
    const wrapper = component();

    expect(inputValue(wrapper)).to.equal(12);
    expect(sliderValue(wrapper)).to.equal(12);

    wrapper.setProps({ value: '' });
    wrapper.update();

    expect(inputValue(wrapper)).to.equal('');
    expect(sliderValue(wrapper)).to.equal('');
  });

  it('does not allow undefined values', () => {
    props = {
      value: 12,
    };
    const wrapper = component();

    expect(inputValue(wrapper)).to.equal(12);
    expect(sliderValue(wrapper)).to.equal(12);

    wrapper.setProps({ value: '' });
    wrapper.update();

    expect(inputValue(wrapper)).to.equal(0);
    expect(sliderValue(wrapper)).to.equal(0);
  });

  it('forces 0 to be undefined values', () => {
    props = {
      allowUndefined: true,
      forceUndefined: true,
      value: 12,
    };
    const wrapper = component();

    expect(inputValue(wrapper)).to.equal(12);
    expect(sliderValue(wrapper)).to.equal(12);

    wrapper.setProps({ value: 0 });
    wrapper.update();

    expect(inputValue(wrapper)).to.equal('');
    expect(sliderValue(wrapper)).to.equal('');
  });

  it('does not force 0 to be undefined values when undefined values are not allowed', () => {
    props = {
      forceUndefined: true,
      value: 12,
    };
    const wrapper = component();

    expect(inputValue(wrapper)).to.equal(12);
    expect(sliderValue(wrapper)).to.equal(12);

    wrapper.setProps({ value: 0 });
    wrapper.update();

    expect(inputValue(wrapper)).to.equal(0);
    expect(sliderValue(wrapper)).to.equal(0);
  });

  describe('onChange', () => {
    it('let the user type his value when it is less than max', () => {
      const onChange = sinon.spy();
      props = {
        value: 12,
        onChange,
        max: 50,
      };
      const wrapper = component();

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 15 } });

      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.args).to.deep.equal([15]);
    });

    it('does not let the user type more than max', () => {
      const onChange = sinon.spy();
      props = {
        value: 12,
        onChange,
        max: 50,
      };
      const wrapper = component();

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 60 } });

      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.args).to.deep.equal([50]);
    });

    it('does not let the user type an empty string when undefined values are not allowed', () => {
      const onChange = sinon.spy();
      props = {
        value: 12,
        onChange,
        max: 50,
      };
      const wrapper = component();

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: '' } });

      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.args).to.deep.equal([0]);
    });

    it('let the user type empty strings when undefined values are allowed', () => {
      const onChange = sinon.spy();
      props = {
        value: 12,
        onChange,
        allowUndefined: true,
        max: 50,
      };
      const wrapper = component();

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: '' } });

      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.args).to.deep.equal(['']);
    });

    it('forces 0 values to empty strings when forceUndefined and allowUndefined are true', () => {
      const onChange = sinon.spy();
      props = {
        value: 12,
        onChange,
        allowUndefined: true,
        forceUndefined: true,
      };
      const wrapper = component();

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: '' } });

      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.args).to.deep.equal(['']);
    });

    it('does not force 0 values to empty strings when forceUndefined is true but undefined values are not allowed', () => {
      const onChange = sinon.spy();
      props = {
        value: 12,
        onChange,
        forceUndefined: true,
      };
      const wrapper = component();

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 0 } });

      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.args).to.deep.equal([0]);
    });
  });
});
