// @flow
import React from 'react';

import Select from '../../../Select';
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
  <div className="financing-structures-property-picker">
    <Select value={value} options={options} onChange={handleChange} />
  </div>
);

export default FinancingStructuresPropertyPickerContainer(FinancingStructuresPropertyPicker);
