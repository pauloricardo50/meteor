import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import IconButton from 'core/components/IconButton';
import { toMoney } from 'core/utils/conversionFunctions';

const Widget1SingleInputInput = ({
  value,
  setInputValue,
  auto,
  unsetValue,
}) => (
  <div className={classnames({ 'widget1-input': true, auto })}>
    <span className="currency">CHF</span>
    {/* Use type tel to display right keyboard without type number issues */}
    <input type="tel" value={toMoney(value)} onChange={setInputValue} />
    <IconButton type="close" tooltip="Effacer" onClick={unsetValue} />
  </div>
);

Widget1SingleInputInput.propTypes = {
  value: PropTypes.any,
  setInputValue: PropTypes.func.isRequired,
  auto: PropTypes.bool.isRequired,
  unsetValue: PropTypes.func.isRequired,
};

Widget1SingleInputInput.defaultProps = {
  value: '',
};

export default Widget1SingleInputInput;
