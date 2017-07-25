import React from 'react';
import PropTypes from 'prop-types';

import RadioButton from 'material-ui/RadioButton/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';

import { T } from '/imports/ui/components/general/Translation.jsx';

const RadioButtons = ({
  options,
  handleChange,
  id,
  intlPrefix,
  currentValue,
  label,
  style,
}) =>
  (<div style={style}>
    <label htmlFor={id}>
      {label}
    </label>
    <RadioButtonGroup
      onChange={(event, value) => handleChange(id, value)}
      valueSelected={currentValue}
      name={id}
      className="flex"
      style={{ justifyContent: ' space-around' }}
    >
      {options.map(option =>
        (<RadioButton
          key={option}
          value={option}
          label={<T id={`${intlPrefix}.${option}`} />}
          style={{ width: 'unset' }}
        />),
      )}
    </RadioButtonGroup>
  </div>);

RadioButtons.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  intlPrefix: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  currentValue: PropTypes.any,
  style: PropTypes.object,
};

RadioButtons.defaultProps = {
  label: '',
  style: {},
  currentValue: undefined,
};

export default RadioButtons;
