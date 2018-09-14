// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'core/utils/testHelpers/enzyme';

import { InputAndSlider } from '../InputAndSlider';
import MoneyInput from '../../../../../MoneyInput/MoneyInput';
import Slider from '../../../../../Material/Slider';

describe('InputAndSlider', () => {
  let props;
  const component = () => mount(<InputAndSlider {...props} />);

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

  describe('handleChange', () => {
    it('let the user type his value when it is less than max', () => {
      const handleChange = sinon.spy();
      props = {
        value: 12,
        handleChange,
        max: 50,
      };
      const wrapper = component();

      wrapper.find('input').simulate('change', { target: { value: 15 } });

      expect(handleChange.calledOnce).to.equal(true);
      expect(handleChange.firstCall.args).to.deep.equal([15]);
    });

    it('does not let the user type more than max', () => {
      const handleChange = sinon.spy();
      props = {
        value: 12,
        handleChange,
        max: 50,
      };
      const wrapper = component();

      wrapper.find('input').simulate('change', { target: { value: 60 } });

      expect(handleChange.calledOnce).to.equal(true);
      expect(handleChange.firstCall.args).to.deep.equal([50]);
    });

    it('does not let the user type an empty string', () => {
      const handleChange = sinon.spy();
      props = {
        value: 12,
        handleChange,
        max: 50,
      };
      const wrapper = component();

      wrapper.find('input').simulate('change', { target: { value: '' } });

      expect(handleChange.calledOnce).to.equal(true);
      expect(handleChange.firstCall.args).to.deep.equal([0]);
    });

    it('let the user type empty strings', () => {
      const handleChange = sinon.spy();
      props = {
        value: 12,
        handleChange,
        allowUndefined: true,
        max: 50,
      };
      const wrapper = component();

      wrapper.find('input').simulate('change', { target: { value: '' } });

      expect(handleChange.calledOnce).to.equal(true);
      expect(handleChange.firstCall.args).to.deep.equal(['']);
    });

    it('forces 0 values to empty strings', () => {
      const handleChange = sinon.spy();
      props = {
        value: 12,
        handleChange,
        allowUndefined: true,
        forceUndefined: true,
      };
      const wrapper = component();

      wrapper.find('input').simulate('change', { target: { value: '' } });

      expect(handleChange.calledOnce).to.equal(true);
      expect(handleChange.firstCall.args).to.deep.equal(['']);
    });

    it('does not let the user enter an empty string', () => {
      const handleChange = sinon.spy();
      props = {
        value: 12,
        handleChange,
      };
      const wrapper = component();

      wrapper.find('input').simulate('change', { target: { value: '' } });

      expect(handleChange.calledOnce).to.equal(true);
      expect(handleChange.firstCall.args).to.deep.equal([0]);
    });
  });
});
