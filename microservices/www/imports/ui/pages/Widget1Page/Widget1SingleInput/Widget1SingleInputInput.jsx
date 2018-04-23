import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';
import { toMoney } from 'core/utils/conversionFunctions';

const Widget1SingleInputInput = ({ value, setInputValue, auto, setAuto }) => (
  <div className="widget1-input">
    <span className="currency">CHF</span>
    {/* Use type tel to display right keyboard without type number issues */}
    <input type="tel" value={toMoney(value)} onChange={setInputValue} />
    <IconButton
      type={auto ? 'lock' : 'lockOpen'}
      tooltip={auto ? 'Passer en mode manuel' : 'Passer en mode suggestion'}
      onClick={setAuto}
    />
  </div>
);

Widget1SingleInputInput.propTypes = {
  value: PropTypes.number,
  setInputValue: PropTypes.func.isRequired,
  auto: PropTypes.bool.isRequired,
  setAuto: PropTypes.func.isRequired,
};

export default Widget1SingleInputInput;
