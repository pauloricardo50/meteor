import PropTypes from 'prop-types';
import React from 'react';

import SelectField from '/imports/ui/components/general/Material/SelectField';
import MenuItem from '/imports/ui/components/general/Material/MenuItem';

const StartSelectField = (props) => {
  const {
    value,
    id,
    formState,
    setFormState,
    setActiveLine,
    options,
    autoFocus,
  } = props;

  return (
    <SelectField
      value={value || formState[id] || ''}
      onChange={(e, i, v) => setFormState(id, v, () => setActiveLine(''))}
      maxHeight={200}
      hintText="Choisissez..."
    >
      {/* <MenuItem value={null} primaryText="Choisissez..." /> */}
      {options.map(
        option =>
          option.id !== undefined && (
            <MenuItem
              value={option.id}
              primaryText={option.label}
              key={option.id}
              autoFocus={autoFocus}
            />
          ),
      )}
    </SelectField>
  );
};

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
