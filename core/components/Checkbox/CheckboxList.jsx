import React from 'react';
import Checkbox from './Checkbox';

const CheckboxList = ({ options, value, onChange, label, className }) => (
  <div className={className}>
    <b>{label}</b>

    {options.map(({ id, label: optionLabel, ...rest }) => (
      <Checkbox
        key={id}
        value={value.includes(id)}
        id={id}
        label={optionLabel}
        onChange={(event, checked) => {
          if (checked && !value.includes(id)) {
            onChange([...value, id]);
          } else if (!checked) {
            onChange(value.filter(item => item !== id));
          }
        }}
        {...rest}
      />
    ))}
  </div>
);

export default CheckboxList;
