import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import classnames from 'classnames';

import { swissFrancMask, percentMask } from '../utils/textMasks';
import { toNumber } from '../utils/conversionFunctions';
import * as financeConstants from '../config/financeConstants';

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
      placeholder: financeConstants.CURRENCY,
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

const TextInput = (props) => {
  const {
    className,
    label,
    style,
    labelStyle,
    id,
    info,
    error,
    placeholder,
    fullWidth,
    onChange,
    intl,
    inputComponent,
    inputProps,
    InputProps,
    noIntl,
    classes,
    simpleOnChange,
    inputRef,
    ...otherProps
  } = props;

  const {
    onChangeHandler,
    showMask,
    mask,
    placeholder: defaultPlaceholder,
    value,
  } = getDefaults(props);

  let finalPlaceholder;
  if (noIntl) {
    finalPlaceholder = placeholder || defaultPlaceholder;
  } else {
    finalPlaceholder =
      placeholder && typeof placeholder === 'string'
        ? intl.formatMessage({ id: placeholder })
        : defaultPlaceholder;
  }

  // Ignore placeholder for money inputs, and just show the currency
  // Showing an amount is confusing
  if (props.type === 'money') {
    finalPlaceholder = defaultPlaceholder;
  }

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
          placeholder: finalPlaceholder,
          noValidate: true,
          mask: mask || undefined,
          pattern: mask ? '[0-9]*' : undefined,
        }}
      />
      {info && <FormHelperText>{info}</FormHelperText>}
    </FormControl>
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  type: PropTypes.string,
  info: PropTypes.node,
  placeholder: PropTypes.node,
  error: PropTypes.bool,
  inputComponent: PropTypes.func,
  inputProps: PropTypes.object,
  noIntl: PropTypes.bool,
  simpleOnChange: PropTypes.bool, // Removes all onChange modifications
};

TextInput.defaultProps = {
  id: undefined,
  onChange: undefined,
  label: '',
  value: undefined,
  type: undefined,
  info: undefined,
  placeholder: undefined,
  error: false,
  inputComponent: null,
  inputProps: undefined,
  noIntl: false,
  simpleOnChange: false,
};

export default injectIntl(TextInput);
