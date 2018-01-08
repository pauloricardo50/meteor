import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';
import { swissFrancMask, percentMask } from '../utils/textMasks';
import { toNumber } from '../utils/conversionFunctions';
import constants from '../config/constants';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const getDefaults = ({
  type, id, onChange, value,
}) => {
  switch (type) {
    case 'money':
      return {
        onChangeHandler: event => onChange(id, toNumber(event.target.value)),
        showMask: true,
        mask: swissFrancMask,
        placeholder: constants.getCurrency(),
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
    label,
    style,
    labelStyle,
    id,
    info,
    error,
    inputRef,
    placeholder,
    fullWidth,
    onChange,
    intl,
    inputComponent,
    inputProps,
    noIntl,
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
    finalPlaceholder = placeholder
      ? intl.formatMessage({ id: placeholder })
      : defaultPlaceholder;
  }

  // Ignore placeholder for money inputs, and just show the currency
  if (props.type === 'money') {
    finalPlaceholder = defaultPlaceholder;
  }

  return (
    <FormControl error={error} className="mui-text-input" style={style}>
      {label && (
        <InputLabel htmlFor={id} style={labelStyle} shrink>
          {label}
        </InputLabel>
      )}
      <Input
        id={id}
        onChange={onChangeHandler}
        type="text"
        style={{ fontSize: 'inherit' }}
        inputComponent={inputComponent || (showMask ? MaskedInput : undefined)}
        inputProps={{
          value,
          placeholder: finalPlaceholder,
          noValidate: true,
          mask: mask || undefined,
          pattern: mask ? '[0-9]*' : undefined,
          ref: inputRef,
          ...inputProps,
          ...otherProps,
        }}
      />
      {info && <FormHelperText>{info}</FormHelperText>}
    </FormControl>
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  type: PropTypes.string,
  info: PropTypes.node,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  inputComponent: PropTypes.func,
  inputProps: PropTypes.object,
  noIntl: PropTypes.bool,
  inputRef: PropTypes.func,
};

TextInput.defaultProps = {
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
  inputRef: undefined,
};

export default injectIntl(TextInput);
