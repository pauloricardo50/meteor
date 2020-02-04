//      
import React from 'react';

import Select from '../../../Select';
import FinancingPropertyPickerContainer from './FinancingPropertyPickerContainer';

                                     
                     
                
                         
  

const FinancingPropertyPicker = ({
  options,
  value,
  handleChange,
  disabled,
}                              ) => (
  <div className="financing-structures-property-picker propertyId">
    <Select
      value={value}
      options={options}
      onChange={handleChange}
      disabled={disabled}
    />
  </div>
);

export default FinancingPropertyPickerContainer(FinancingPropertyPicker);
