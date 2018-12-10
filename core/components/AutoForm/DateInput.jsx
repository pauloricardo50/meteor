import PropTypes from 'prop-types';
import React from 'react';

import TextInput from './TextInput';

const DateInput = (props) => {
  const { inputProps } = props;

  return (
    <TextInput
      {...props}
      inputProps={{
        ...inputProps,
        date: true,
        inputType: 'date',
      }}
    />
  );
};

DateInput.propTypes = {
  currentValue: PropTypes.object,
  disabled: PropTypes.bool,
  docId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  maxDate: PropTypes.objectOf(PropTypes.any),
  minDate: PropTypes.objectOf(PropTypes.any),
  openDirection: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  updateFunc: PropTypes.string.isRequired,
};

DateInput.defaultProps = {
  maxDate: undefined,
  minDate: undefined,
  currentValue: undefined,
  style: {},
  disabled: false,
  openDirection: undefined,
};

export default DateInput;
