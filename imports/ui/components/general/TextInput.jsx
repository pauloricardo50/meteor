import React from 'react';

const TextInput = props => (
  <div className="col-sm-10 col-sm-offset-1 animated fadeIn">
    <div className="form-group">
      <label className="control-label" htmlFor={props.name}>{props.label}</label>
      <div>
        <input name={props.name} value={props.currentValue} type="text" placeholder={props.placeholder} className="form-control input-md" />
      </div>
    </div>
  </div>
);

export default TextInput;
