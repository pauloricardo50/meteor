import React from 'react';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';


const DropdownInput = props => (
  <FormGroup controlId="formControlsSelect">
    <ControlLabel>{props.label}</ControlLabel>
    <FormControl componentClass="select" placeholder={props.placeholder}>
      {props.options.map(option =>
        <option value={option.label}>{option.label}</option>
      )}
    </FormControl>
  </FormGroup>
);

DropdownInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default DropdownInput;
