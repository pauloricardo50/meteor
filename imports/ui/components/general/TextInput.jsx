import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import TextField from 'material-ui/TextField';

import MaskedInput from 'react-text-mask';
import { swissFrancMask, percentMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

const getDefaults = ({ type, id, handleChange, currentValue }) => {
  switch (type) {
    case 'money':
      return {
        onChangeHandler: event =>
          handleChange(id, toNumber(event.target.value)),
        showMask: true,
        mask: swissFrancMask,
        placeholder: constants.getCurrency(),
        currentValue,
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
        currentValue: (currentValue * 100).toFixed(2),
      };
    default:
      return {
        onChangeHandler: event => handleChange(id, event.target.value),
        showMask: false,
        currentValue,
      };
  }
};

const TextInput = (props) => {
  const { label } = props;

  // Remove props that aren't needed
  const passedProps = _.omit(props, ['handleChange', 'currentValue', 'label']);

  const {
    onChangeHandler,
    showMask,
    mask,
    placeholder,
    currentValue,
  } = getDefaults(props);

  return (
    <TextField
      floatingLabelText={label}
      type="text"
      onChange={onChangeHandler}
      style={{ fontSize: 'inherit' }}
      floatingLabelStyle={{ fontSize: 'initial' }}
      {...passedProps}
      value={showMask ? undefined : currentValue}
    >
      {showMask &&
        <MaskedInput
          value={currentValue}
          placeholder={placeholder}
          mask={mask}
          guide
          pattern="[0-9]*"
        />}
    </TextField>
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleChange: PropTypes.func.isRequired,
};

TextInput.defaultProps = {
  currentValue: undefined,
};

export default TextInput;
