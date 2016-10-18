import React from 'react';

const RadioInput = props => (
  <div className="form-group" onChange={props.onChange}>
    <label>{props.label}</label>
    <div className="radio-inline">
      <label>
        <input type="radio" value={props.value1} />
        {props.value1}
      </label>
    </div>
    <div className="radio-inline">
      <label>
        <input type="radio" value={props.value1} />
        {props.value2}
      </label>
    </div>
  </div>
);

RadioInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  value1: React.PropTypes.string.isRequired,
  value2: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default RadioInput;
