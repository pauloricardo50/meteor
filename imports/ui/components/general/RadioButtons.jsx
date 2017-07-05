import React from 'react';
import PropTypes from 'prop-types';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import { T } from '/imports/ui/components/general/Translation.jsx';

const RadioButtons = ({
  options,
  handleChange,
  id,
  intlPrefix,
  currentValue,
  label,
}) =>
  (<div>
    <label htmlFor={id}>
      {label}
    </label>
    <RadioButtonGroup
      onChange={(event, value) => handleChange(id, value)}
      valueSelected={currentValue}
      name={id}
      className="flex"
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
  label: PropTypes.node.isRequired,
  intlPrefix: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  currentValue: PropTypes.node.isRequired,
};

export default RadioButtons;
