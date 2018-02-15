import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from 'material-ui/styles';

import Select from 'core/components/Select';

// Use height 48 to make sure these fields are aligned with text inputs
const styles = {
  root: {
    height: 48,
  },
  selectMenu: {
    height: 48,
  },
};

const StartSelectField = (props) => {
  const {
    value,
    id,
    formState,
    setFormState,
    setActiveLine,
    options,
    classes,
  } = props;

  return (
    <Select
      classes={{ root: classes.root, selectMenu: classes.selectMenu }}
      id={id}
      value={value || formState[id] || ''}
      onChange={(_, newValue) =>
        setFormState(id, newValue, () => setActiveLine(''))
      }
      style={{ width: 200, fontSize: 'initial', height: 48 }}
      inputStyle={{ height: 48 }}
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

export default withStyles(styles)(StartSelectField);
