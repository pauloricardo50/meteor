import React from 'react';

import TextField from 'material-ui/TextField';

const TextInput = props => (
  <div className="form-group">
    {/* <label htmlFor={props.id}>{props.label}</label>
    <input
      id={props.id}
      value={props.currentValue}
      type="text"
      placeholder={props.placeholder}
      className="form-control"
    /> */}
    <TextField
      floatingLabelText={props.label}
      hintText={props.placeholder}
      value={props.currentValue}
      type="text"
      id={props.id}
      fullWidth
    />
  </div>
);

TextInput.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  currentValue: React.PropTypes.string,
};

export default TextInput;
