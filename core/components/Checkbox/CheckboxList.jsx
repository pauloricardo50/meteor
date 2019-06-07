// @flow
import React from 'react';
import { withState } from 'recompose';
import Checkbox from './Checkbox';

type CheckboxListProps = {};

const CheckboxList = ({
  options,
  value,
  onChange,
  label,
  className,
  isHovering,
  setHover,
  renderValue,
}: CheckboxListProps) => (
  <div
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    className={className}
  >
    <b>{label}</b>
    {!isHovering && (
      <div className="flex-col">
        {value.map(i => (
          <span key={i}>{options.find(({ id }) => id === i).label}</span>
        ))}
      </div>
    )}
    {isHovering
      && options.map(({ id, label: optionLabel, ...rest }) => (
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

export default withState('isHovering', 'setHover', false)(CheckboxList);
