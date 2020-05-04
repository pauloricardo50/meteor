import React from 'react';
import cx from 'classnames';

import InputAdornment from '../Material/InputAdornment';
import TextField from '../Material/TextField';

const getStartAdornment = ({ dataType, startAdornment }) => {
  if (dataType === 'money') {
    return <InputAdornment position="start">CHF</InputAdornment>;
  }

  if (startAdornment) {
    return <InputAdornment position="start">{startAdornment}</InputAdornment>;
  }

  return null;
};

const getEndAdornment = ({ endAdornment }) => {
  if (endAdornment) {
    return <InputAdornment position="end">{endAdornment}</InputAdornment>;
  }

  return null;
};

// A hack for number inputs because material-ui can't be sure of the initial
// shrink value: https://material-ui.com/components/text-fields/#floating-label
const shouldShrinkLabel = (value, notched) => {
  if (notched !== undefined) {
    return notched;
  }

  return !!value || undefined;
};

const TextInput = props => {
  const {
    classes,
    className,
    dataType,
    endAdornment,
    error,
    fullWidth,
    id,
    info,
    helperText = info,
    inputComponent,
    InputLabelProps,
    inputProps,
    InputProps = {},
    inputRef,
    label,
    labelStyle,
    notched,
    onChange,
    placeholder,
    required,
    startAdornment,
    style,
    type = 'text',
    value,
    ...otherProps
  } = props;

  return (
    <TextField
      className={cx('mui-text-input', className)}
      error={!!error}
      fullWidth={fullWidth}
      helperText={helperText}
      id={id}
      InputLabelProps={{
        style: labelStyle,
        shrink: shouldShrinkLabel(value),
        ...InputLabelProps,
      }}
      InputProps={{
        className: classes ? Object.values(classes).join(' ') : '',
        style: { fontSize: 'inherit' },
        startAdornment: getStartAdornment({ dataType, startAdornment }),
        endAdornment: getEndAdornment({ endAdornment }),
        notched: shouldShrinkLabel(value, notched),
        inputComponent,
        ...InputProps,
        inputProps: {
          ...inputProps,
          ...InputProps.inputProps,
        },
      }}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      type={type}
      value={value}
      required={required}
      {...otherProps}
    />
  );
};

export default TextInput;
