// @flow
import React from 'react';
import Slider from 'core/components/Material/Slider';
import cx from 'classnames';

import { compose, withProps } from 'recompose';
import MoneyInput from '../../../../MoneyInput';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import { toMoney } from '../../../../../utils/conversionFunctions';

type InputAndSliderProps = {
  value: number,
  handleChange: Function,
  max?: number,
  className: string,
};

const valueIsNotDefined = value =>
  value === '' || value === undefined || value === null;

const makeHandleTextChange = ({
  handleChange,
  max,
  allowUndefined,
  forceUndefined,
}) => (value) => {
  if (allowUndefined && valueIsNotDefined(value)) {
    return handleChange('');
  }
  if (max && value) {
    return handleChange(Math.min(value, max));
  }
  return handleChange(value || (forceUndefined && allowUndefined ? '' : 0));
};

const setValue = (value, allowUndefined, forceUndefined) => {
  if (allowUndefined) {
    return forceUndefined && value === 0
      ? ''
      : (valueIsNotDefined(value) && '') || value;
  }
  return value || 0;
};

export const InputAndSlider = (props: InputAndSliderProps) => {
  const {
    value,
    handleChange,
    max = 1000000,
    className,
    allowUndefined,
    forceUndefined,
    placeholder,
  } = props;
  return (
    <div className={cx('input-and-slider', className)}>
      <MoneyInput
        value={setValue(value, allowUndefined, forceUndefined)}
        onChange={makeHandleTextChange(props)}
        placeholder={placeholder}
      />
      <Slider
        min={0}
        max={max}
        step={1000}
        value={setValue(value, allowUndefined, forceUndefined)}
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
  withProps(({ max: _max, calculatePlaceholder, placeholder, ...props }) => ({
    max: typeof _max === 'function' ? _max(props) : _max,
    placeholder: calculatePlaceholder
      ? toMoney(calculatePlaceholder(props))
      : placeholder,
  })),
)(InputAndSlider);
