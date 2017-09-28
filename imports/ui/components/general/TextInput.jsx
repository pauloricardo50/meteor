import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';
import { swissFrancMask, percentMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const getDefaults = ({ type, id, onChange, value }) => {
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
    default:
      return {
        onChangeHandler: event => onChange(id, event.target.value),
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
    ref,
    placeholder,
    fullWidth,
    onChange,
    intl,
    ...otherProps
  } = props;

  const {
    onChangeHandler,
    showMask,
    mask,
    placeholder: defaultPlaceholder,
    value,
  } = getDefaults(props);

  const finalPlaceholder = placeholder
    ? intl.formatMessage({ id: placeholder })
    : defaultPlaceholder;

  return (
    <FormControl error={error} className="mui-text-input" style={style}>
      {label && (
        <InputLabel htmlFor={id} style={labelStyle} shrink>
          {label}
        </InputLabel>
      )}
      <Input
        {...otherProps}
        id={id}
        // value={value}
        onChange={onChangeHandler}
        type="text"
        style={{ fontSize: 'inherit' }}
        inputComponent={showMask ? MaskedInput : undefined}
        inputProps={{
          value,
          placeholder: finalPlaceholder,
          noValidate: true,
          mask: mask || undefined,
          guide: !!mask,
          pattern: mask ? '[0-9]*' : undefined,
        }}
        inputRef={ref}
      />
      {info && <FormHelperText>{info}</FormHelperText>}
    </FormControl>
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  info: PropTypes.node,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
};

TextInput.defaultProps = {
  label: '',
  value: undefined,
  type: undefined,
  info: undefined,
  placeholder: undefined,
  error: false,
};

export default injectIntl(TextInput);
