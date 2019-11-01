import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import classnames from 'classnames';

import InputAdornment from '../Material/InputAdornment';
import FormHelperText from '../Material/FormHelperText';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';
import FormControl from '../Material/FormControl';
import Input from '../Material/Input';
import { swissFrancMask, percentMask } from '../../utils/textMasks';
import { toNumber } from '../../utils/conversionFunctions';

const getDefaults = ({ type, id, onChange, value, simpleOnChange }) => {
  if (simpleOnChange) {
    return { onChangeHandler: onChange, value };
  }

  switch (type) {
  case 'money':
    return {
      onChangeHandler: event => onChange(toNumber(event.target.value), id),
      showMask: true,
      mask: swissFrancMask,
      placeholder: 0,
      value,
    };
  case 'percent':
    return {
      onChangeHandler: event =>
        onChange(
          Math.round(parseFloat(event.target.value) * 100) / 10000,
          id,
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
      onChangeHandler: event => onChange(event.target.value, id, event),
      onDateChange: (val) => {
        // This specific format should be used for the server to get the
        // date in the right order
        const date = moment(val).format('YYYY-MM-DD');
        // Allow setting a date to null
        onChange(val ? date : null, id, {});
      },
      showMask: false,
      value: value ? moment(value) : null,
    };
  default:
    return {
      // Pass event as third argument, for some components which need it
      // like react-autosuggest
      onChangeHandler: event => onChange(event.target.value, id, event),
      showMask: false,
      value,
    };
  }
};

export const getFinalPlaceholder = ({
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
    finalPlaceholder = placeholder && typeof placeholder === 'string'
      ? `${intl.formatMessage({
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
    inputType,
    inputLabelProps,
    ...otherProps
  } = props;

  const {
    onChangeHandler,
    onDateChange,
    showMask,
    mask,
    placeholder: defaultPlaceholder,
    value,
  } = getDefaults(props);
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);

  return (
    <FormControl
      error={error}
      className={classnames('mui-text-input', className)}
      style={style}
      fullWidth={fullWidth}
    >
      {label && (
        <InputLabel
          ref={inputLabelRef}
          htmlFor={id}
          style={labelStyle}
          {...inputLabelProps}
        >
          {label}
        </InputLabel>
      )}
      <Input
        {...otherProps}
        labelWidth={labelWidth}
        className={classes ? Object.values(classes).join(' ') : ''}
        id={id}
        onChange={onChangeHandler}
        type={inputType || 'text'}
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
          onDateChange: inputType === 'date' ? onDateChange : undefined,
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
