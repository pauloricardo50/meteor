import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import classnames from 'classnames';

import { swissFrancMask, percentMask } from '../utils/textMasks';
import { toNumber } from '../utils/conversionFunctions';

const getDefaults = ({ type, id, onChange, value, simpleOnChange }) => {
  if (simpleOnChange) {
    return { onChangeHandler: onChange, value };
  }

  switch (type) {
  case 'money':
    return {
      onChangeHandler: event => onChange(id, toNumber(event.target.value)),
      showMask: true,
      mask: swissFrancMask,
      placeholder: 0,
      value,
    };
  case 'percent':
    return {
      onChangeHandler: event =>
        onChange(
          id,
          Math.round(parseFloat(event.target.value) * 100) / 10000,
        ),
      showMask: true,
      mask: percentMask,
      placeholder: '%',
      value: (value * 100).toFixed(2),
    };
  case 'number':
    return {
      onChangeHandler: event => onChange(id, toNumber(event.target.value)),
      showMask: false,
      value,
    };
  case 'date':
    return {
      onChangeHandler: undefined,
      showMask: false,
      value: '',
    };
  default:
    return {
      // Pass event as third argument, for some components which need it
      // like react-autosuggest
      onChangeHandler: event => onChange(id, event.target.value, event),
      showMask: false,
      value,
    };
  }
};

const getFinalPlaceholder = ({
  noIntl,
  placeholder,
  defaultPlaceholder,
  intl,
  type,
}) => {
  let finalPlaceholder;
  if (noIntl) {
    finalPlaceholder = placeholder || defaultPlaceholder;
  } else {
    finalPlaceholder =
      placeholder && typeof placeholder === 'string'
        ? intl.formatMessage({ id: placeholder }) !== placeholder &&
          `${intl.formatMessage({
            id: 'Forms.textInput.placeholderPrefix',
          })} ${intl.formatMessage({ id: placeholder })}`
        : defaultPlaceholder;
  }

  // Ignore placeholder for money inputs, and just show the currency
  // Showing an amount is confusing
  if (type === 'money') {
    finalPlaceholder = defaultPlaceholder;
  }

  return finalPlaceholder;
};
const TextInput = (props) => {
  const {
    classes,
    className,
    error,
    fullWidth,
    id,
    info,
    inputComponent,
    InputProps,
    inputProps,
    inputRef,
    intl,
    label,
    labelStyle,
    noIntl,
    onChange,
    placeholder,
    simpleOnChange,
    style,
    type,
    ...otherProps
  } = props;

  const {
    onChangeHandler,
    showMask,
    mask,
    placeholder: defaultPlaceholder,
    value,
  } = getDefaults(props);

  return (
    <FormControl
      error={error}
      className={classnames({ 'mui-text-input': true, [className]: true })}
      style={style}
    >
      {label && (
        <InputLabel htmlFor={id} style={labelStyle} shrink>
          {label}
        </InputLabel>
      )}
      <Input
        {...otherProps}
        className={classes ? Object.values(classes).join(' ') : ''}
        id={id}
        onChange={onChangeHandler}
        type="text"
        style={{ fontSize: 'inherit' }}
        inputComponent={showMask ? MaskedInput : inputComponent || undefined}
        inputProps={{
          ...inputProps, // Backwards compatible
          ...InputProps,
          value,
          placeholder: getFinalPlaceholder({
            noIntl,
            placeholder,
            defaultPlaceholder,
            intl,
            type,
          }),
          noValidate: true,
          mask: mask || undefined,
          pattern: mask ? '[0-9]*' : undefined,
        }}
        startAdornment={
          props.type === 'money' ? (
            <InputAdornment position="start">CHF</InputAdornment>
          ) : null
        }
      />
      {info && <FormHelperText>{info}</FormHelperText>}
    </FormControl>
  );
};

TextInput.propTypes = {
  error: PropTypes.bool,
  id: PropTypes.string,
  info: PropTypes.node,
  inputComponent: PropTypes.func,
  inputProps: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  noIntl: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.node,
  simpleOnChange: PropTypes.bool, // Removes all onChange modifications
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TextInput.defaultProps = {
  error: false,
  id: undefined,
  info: undefined,
  inputComponent: null,
  inputProps: undefined,
  label: '',
  noIntl: false,
  onChange: undefined,
  placeholder: undefined,
  simpleOnChange: false,
  type: undefined,
  value: undefined,
};

export default injectIntl(TextInput);
