import React from 'react';

const TextInput = props => (
  <div className="form-group">
    <label htmlFor={props.id}>{props.label}</label>
    <input
      id={props.id}
      value={props.currentValue}
      type="text"
      placeholder={props.placeholder}
      className="form-control"
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
