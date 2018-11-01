// @flow
import React from 'react';

import Select from '../../../Select';
import FinancingPropertyPickerContainer from './FinancingPropertyPickerContainer';

type FinancingPropertyPickerProps = {
  options: Array<{}>,
  value: string,
  handleChange: Function,
};

const FinancingPropertyPicker = ({
  options,
  value,
  handleChange,
}: FinancingPropertyPickerProps) => (
  <div className="financing-structures-property-picker propertyId">
    <Select value={value} options={options} onChange={handleChange} />
  </div>
);

export default FinancingPropertyPickerContainer(FinancingPropertyPicker);
