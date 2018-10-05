// @flow
import React from 'react';

import Select from '../../../Select';
import CalculatedValue from '../FinancingSection/components/CalculatedValue';
import FinancingPropertyPickerContainer from './FinancingPropertyPickerContainer';

type FinancingPropertyPickerProps = {
  options: Array<{}>,
  value: string,
  property: Object,
  handleChange: Function,
  updatePropertyValue: Function,
};

const FinancingPropertyPicker = ({
  options,
  value,
  property,
  handleChange,
  updatePropertyValue,
}: FinancingPropertyPickerProps) => (
  <div className="financing-structures-property-picker propertyId">
    <Select value={value} options={options} onChange={handleChange} />
  </div>
);

export default FinancingPropertyPickerContainer(FinancingPropertyPicker);
