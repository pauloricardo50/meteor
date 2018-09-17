// @flow
import React from 'react';

import Select from '../../../Select';
import CalculatedValue from '../FinancingStructuresSection/components/CalculatedValue';
import FinancingStructuresPropertyPickerContainer from './FinancingStructuresPropertyPickerContainer';

type FinancingStructuresPropertyPickerProps = {
  options: Array<{}>,
  value: string,
  property: Object,
  handleChange: Function,
  updatePropertyValue: Function,
};

const FinancingStructuresPropertyPicker = ({
  options,
  value,
  property,
  handleChange,
  updatePropertyValue,
}: FinancingStructuresPropertyPickerProps) => (
  <div className="financing-structures-property-picker propertyId">
    <Select value={value} options={options} onChange={handleChange} />
  </div>
);

export default FinancingStructuresPropertyPickerContainer(FinancingStructuresPropertyPicker);
