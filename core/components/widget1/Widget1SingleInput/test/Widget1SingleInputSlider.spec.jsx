/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from '../../../../utils/testHelpers';
import IconButton from '../../../IconButton';
import Slider from '../../../Slider';
import Widget1SingleInputSlider from '../Widget1SingleInputSlider';

describe('Widget1SingleInputSlider', () => {
  let props;
  const component = () => shallow(<Widget1SingleInputSlider {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('should render a Slider', () => {
    expect(component().find(Slider).length).to.equal(1);
  });

  it('should pass the value to the slider', () => {
    props.value = 100;
    props.sliderMax = 150;
    expect(
      component()
        .find(Slider)
        .props().value,
    ).to.equal(100);
  });

  it('should pass a value of 0 to slider if value is falsy', () => {
    props.value = '';
    expect(
      component()
        .find(Slider)
        .props().value,
    ).to.equal(0);
    props.value = undefined;
    expect(
      component()
        .find(Slider)
        .props().value,
    ).to.equal(0);
    props.value = null;
    expect(
      component()
        .find(Slider)
        .props().value,
    ).to.equal(0);
  });

  it('should pass the sliderMax to the Slider if the value is larger', () => {
    props.value = 100;
    props.sliderMax = 50;
    expect(
      component()
        .find(Slider)
        .props().value,
    ).to.equal(50);
  });

  it('should render an IconButton if value is large than sliderMax', () => {
    props.sliderMax = 1;
    props.value = 2;
    expect(component().find(IconButton).length).to.equal(1);
  });

  it('should render an IconButton if value is at least 90% of sliderMax', () => {
    props.sliderMax = 1;
    props.value = 0.95;
    expect(component().find(IconButton).length).to.equal(1);
  });

  it('should not render an IconButton if sliderMax is 0', () => {
    props.sliderMax = 0;
    expect(component().find(IconButton).length).to.equal(0);
  });

  it('should not render an IconButton if value is smaller than sliderMax', () => {
    props.sliderMax = 2;
    props.value = 1;
    expect(component().find(IconButton).length).to.equal(0);
  });

  it('should not render an IconButton if sliderMax is allowExtremeLoan is true', () => {
    props.sliderMax = 1;
    props.value = 2;
    props.allowExtremeLoan = true;
    expect(component().find(IconButton).length).to.equal(0);
  });

  it('should use a special tooltip on the button if this is a loanValue', () => {
    props.sliderMax = 1;
    props.value = 2;
    props.isLoanValue = true;

    expect(
      component()
        .find(IconButton)
        .props().tooltip.props.id,
    ).to.include('buttonTooltipLoan');

    props.isLoanValue = false;
    expect(
      component()
        .find(IconButton)
        .props().tooltip.props.id,
    ).to.not.include('buttonTooltipLoan');
  });
});
