import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import TextField from 'material-ui/TextField';

import MaskedInput from 'react-text-mask';
import { swissFrancMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

const InputMoney = (props) => {
  const { id, label, currentValue, handleChange } = props;

  // Remove props that aren't needed
  const passedProps = _.omit(props, ['handleChange', 'currentValue', 'label']);

  return (
    <TextField
      floatingLabelText={label}
      type="text"
      onChange={event => handleChange(id, toNumber(event.target.value))}
      style={{ fontSize: 'inherit' }}
      floatingLabelStyle={{ fontSize: 'initial' }}
      {...passedProps}
    >
      <MaskedInput
        value={currentValue}
        placeholder={constants.getCurrency()}
        mask={swissFrancMask}
        guide
        pattern="[0-9]*"
      />
    </TextField>
  );
};

InputMoney.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleChange: PropTypes.func.isRequired,
};

InputMoney.defaultProps = {
  currentValue: undefined,
};

export default InputMoney;
