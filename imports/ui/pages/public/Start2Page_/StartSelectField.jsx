import PropTypes from 'prop-types';
import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const StartSelectField = props => (
  <SelectField
    value={props.value || props.formState[props.id] || ''}
    onChange={(e, i, v) =>
      props.setFormState(props.id, v, () => props.setActiveLine(''))}
    maxHeight={200}
    hintText="Choisissez..."
  >
    {/* <MenuItem value={null} primaryText="Choisissez..." /> */}
    {props.options.map(
      option =>
        option.id !== undefined &&
        <MenuItem
          value={option.id}
          primaryText={option.label}
          key={option.id}
          autoFocus={props.autoFocus}
        />,
    )}
  </SelectField>
);

StartSelectField.propTypes = {
  id: PropTypes.string.isRequired,
  setFormState: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  autoFocus: PropTypes.bool,
};

StartSelectField.defaultProps = {
  formState: {},
  autoFocus: false,
};

export default StartSelectField;
