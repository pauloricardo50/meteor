import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';
import { toNumber, toMoney } from 'core/utils/conversionFunctions';

const Widget1SingleInputInput = ({ value, setValue, auto, setAuto }) => (
  <div className="widget1-input">
    <span className="currency">CHF</span>
    <input
      type="text"
      value={toMoney(value)}
      onChange={e => setValue(toNumber(e.target.value))}
    />
    <IconButton
      type={auto ? 'lock' : 'lockOpen'}
      tooltip={auto ? 'Passer en mode manuel' : 'Passer en mode suggestion'}
      onClick={setAuto}
    />
  </div>
);

Widget1SingleInputInput.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func.isRequired,
  auto: PropTypes.bool.isRequired,
  setAuto: PropTypes.func.isRequired,
};

export default Widget1SingleInputInput;
