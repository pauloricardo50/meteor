import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import TextField from '/imports/ui/components/general/Material/TextField';

import MaskedInput from 'react-text-mask';
import { swissFrancMask, percentMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const getDefaults = ({ type, id, handleChange, value }) => {
  switch (type) {
    case 'money':
      return {
        onChangeHandler: event =>
          handleChange(id, toNumber(event.target.value)),
        showMask: true,
        mask: swissFrancMask,
        placeholder: constants.getCurrency(),
        value,
      };
    case 'percent':
      return {
        onChangeHandler: event =>
          handleChange(
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
        onChangeHandler: event =>
          handleChange(id, toNumber(event.target.value)),
        showMask: false,
        value,
      };
    default:
      return {
        onChangeHandler: event => handleChange(id, event.target.value),
        showMask: false,
        value,
      };
  }
};

const TextInput = (props) => {
  const { label, style, labelStyle, id, info, error } = props;

  // Remove props that aren't needed
  const passedProps = omit(props, [
    'handleChange',
    'value',
    'label',
    'style',
    'labelStyle',
    'info',
  ]);

  const { onChangeHandler, showMask, mask, placeholder, value } = getDefaults(
    props,
  );

  return (
    <FormControl error={error}>
      {label && (
        <InputLabel htmlFor={id} style={labelStyle}>
          {label}
        </InputLabel>
      )}
      <Input
        id={id}
        value={value}
        onChange={onChangeHandler}
        type="text"
        style={{ fontSize: 'inherit', ...style }}
        inputComponent={showMask && MaskedInput}
        inputProps={
          showMask && {
            value,
            mask,
            placeholder,
            guide: true,
            pattern: '[0-9]*',
          }
        }
        {...passedProps}
      />
      {info && <FormHelperText>{info}</FormHelperText>}
    </FormControl>
    // <TextField
    //   label={label}
    //   type="text"
    //   onChange={onChangeHandler}
    //   style={{ fontSize: 'inherit', ...style }}
    //   floatingLabelStyle={{ fontSize: 'initial', ...labelStyle }}
    //   {...passedProps}
    //   value={showMask ? undefined : value}
    // >
    //   {showMask && (
    //     <MaskedInput
    //       value={value}
    //       placeholder={placeholder}
    //       mask={mask}
    //       guide
    //       pattern="[0-9]*"
    //     />
    //   )}
    // </TextField>
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  info: PropTypes.node,
  error: PropTypes.bool,
};

TextInput.defaultProps = {
  label: '',
  value: undefined,
  type: undefined,
  info: '',
  error: false,
};

export default TextInput;
