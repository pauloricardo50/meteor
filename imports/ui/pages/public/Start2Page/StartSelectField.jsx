import PropTypes from 'prop-types';
import React from 'react';

import Select from '/imports/ui/components/general/Select';

const StartSelectField = (props) => {
  const { value, id, formState, setFormState, setActiveLine, options } = props;

  return (
    <Select
      id={id}
      value={value || formState[id] || ''}
      onChange={(_, newValue) =>
        setFormState(id, newValue, () => setActiveLine(''))}
      style={{ width: 200 }}
      options={options.filter(o => o.id !== undefined)}
    />
  );
};

StartSelectField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.string.isRequired,
  setFormState: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  setActiveLine: PropTypes.func.isRequired,
};

StartSelectField.defaultProps = {
  formState: {},
  value: undefined,
};

export default StartSelectField;
