// @flow
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import StructureUpdateContainer from './StructureUpdateContainer';

type RadioButtonsProps = {
  value: string,
  handleChange: Function,
  options: Array<{ id: string, label: string }>,
};

const RadioButtons = ({ value, handleChange, options }: RadioButtonsProps) => (
  <RadioGroup
    aria-label="Gender"
    value={value}
    onChange={event => handleChange(event.target.value)}
    className="radio-buttons"
  >
    {options.map(({ id, label }) => (
      <FormControlLabel key={id} value={id} control={<Radio />} label={label} />
    ))}
  </RadioGroup>
);

export default StructureUpdateContainer(RadioButtons);
