import React from 'react';
import PropTypes from 'prop-types';

import TextField from '../Material/TextField';
import { injectIntl } from 'react-intl';

import { T } from '/imports/ui/components/general/Translation';

const DateInput = (props) => {
  const {
    currentValue,
    handleChange,
    id,
    minDate,
    maxDate,
    disabled,
    style,
    intl,
    label,
  } = props;
  const formatDate = intl.formatDate;
  return (
    // <MuiDatePicker
    //   value={currentValue}
    //   onChange={(_, date) => handleChange(id, date)}
    //   id={id}
    //   minDate={minDate}
    //   maxDate={maxDate}
    //   formatDate={date =>
    //     formatDate(date, {
    //       month: 'long',
    //       year: 'numeric',
    //       weekday: 'long',
    //       day: '2-digit',
    //     })}
    //   cancelLabel={<T id="general.cancel" />}
    //   disabled={disabled}
    //   style={style}
    //   textFieldStyle={{ width: '100%' }}
    // />
    <TextField
      id={id}
      label={label}
      type="date"
      defaultValue={new Date()}
      // className={classes.textField}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

DateInput.propTypes = {
  currentValue: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

DateInput.defaultProps = {
  currentValue: undefined,
  minDate: undefined,
  maxDate: undefined,
  disabled: false,
  style: {},
};

export default injectIntl(DateInput);
