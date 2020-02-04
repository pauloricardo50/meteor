//      
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import cx from 'classnames';

import T from 'core/components/Translation';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';

                          
                
                            
                                                
                    
  

const RadioButtons = ({
  value,
  updateStructure,
  options,
  className,
}                   ) => (
  <RadioGroup
    aria-label="Gender"
    value={value}
    onChange={event => updateStructure(event.target.value)}
    className={cx('radio-buttons', className)}
  >
    {options.map(({ id, label }) => (
      <FormControlLabel
        key={id}
        value={id}
        control={<Radio />}
        label={<T id={label} />}
      />
    ))}
  </RadioGroup>
);

export default StructureUpdateContainer(RadioButtons);
