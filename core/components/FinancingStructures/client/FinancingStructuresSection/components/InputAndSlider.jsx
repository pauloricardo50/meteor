// @flow
import React from 'react';
import Slider from 'core/components/Material/Slider';
import cx from 'classnames';

import { compose, withProps } from 'recompose';
import MoneyInput from '../../../../MoneyInput';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';

type InputAndSliderProps = {
  value: number,
  handleChange: Function,
  max?: number,
  className: string,
};

const makeHandleTextChange = ({ handleChange, max }) => (value) => {
  if (max && value) {
    handleChange(Math.min(value, max));
  } else {
    handleChange(value || 0);
  }
};

const InputAndSlider = (props: InputAndSliderProps) => {
  const { value, handleChange, max = 1000000, className } = props;
  return (
    <div className={cx('input-and-slider', className)}>
      <MoneyInput value={value || 0} onChange={makeHandleTextChange(props)} />
      <Slider
        min={0}
        max={max}
        step={1000}
        value={value}
        onChange={handleChange}
        className="slider"
      />
    </div>
  );
};

export default compose(
  FinancingStructuresDataContainer({ asArrays: true }),
  SingleStructureContainer,
  StructureUpdateContainer,
  withProps(({ max: _max, ...props }) => ({
    max: typeof _max === 'function' ? _max(props) : _max,
  })),
)(InputAndSlider);
