// @flow
import React from 'react';

import Select from '../../../Select';
import CalculatedValue from '../FinancingStructuresSection/components/CalculatedValue';
import FinancingStructuresPropertyPickerContainer from './FinancingStructuresPropertyPickerContainer';

type FinancingStructuresPropertyPickerProps = {
  options: Array<{}>,
  value: string,
  property: Object,
};

const FinancingStructuresPropertyPicker = ({
  options,
  value,
  property,
  handleChange,
}: FinancingStructuresPropertyPickerProps) => (
  <div className="financing-structures-property-picker propertyId">
    <Select value={value} options={options} onChange={handleChange} />
    <CalculatedValue value={property.value} money />
  </div>
);

export default FinancingStructuresPropertyPickerContainer(FinancingStructuresPropertyPicker);
