// @flow
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import cx from 'classnames'

import StructureUpdateContainer from './StructureUpdateContainer';

type RadioButtonsProps = {
  value: string,
  handleChange: Function,
  options: Array<{ id: string, label: string }>,
  className: string,
};

const RadioButtons = ({ value, handleChange, options, className }: RadioButtonsProps) => (
  <RadioGroup
    aria-label="Gender"
    value={value}
    onChange={event => handleChange(event.target.value)}
    className={cx("radio-buttons", className)}
  >
    {options.map(({ id, label }) => (
      <FormControlLabel key={id} value={id} control={<Radio />} label={label} />
    ))}
  </RadioGroup>
);

export default StructureUpdateContainer(RadioButtons);
