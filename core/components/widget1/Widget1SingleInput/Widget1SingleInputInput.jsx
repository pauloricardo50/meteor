import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { toMoney } from '../../../utils/conversionFunctions';
import InputAdornment from '../../Material/InputAdornment';
import Input from '../../Material/Input';
import T from '../../Translation';
import IconButton from '../../IconButton';

const Widget1SingleInputInput = ({
  name,
  value,
  setInputValue,
  auto,
  unsetValue,
  tabIndex,
}) => (
  <div className={classnames('widget1-input', { auto })}>
    {/* Use type tel to display right keyboard without type number issues */}
    <Input
      id={name}
      type="tel"
      value={toMoney(value)}
      onChange={setInputValue}
      startAdornment={(
        <InputAdornment position="start">
          <span className="widget1-input-currency">CHF</span>
        </InputAdornment>
      )}
      endAdornment={(
        <InputAdornment position="end">
          <IconButton
            type="close"
            tooltip={<T id="general.erase" />}
            onClick={unsetValue}
            tabIndex={-1}
          />
        </InputAdornment>
      )}
      tabIndex={tabIndex}
    />
  </div>
);

Widget1SingleInputInput.propTypes = {
  auto: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  tabIndex: PropTypes.number,
  unsetValue: PropTypes.func.isRequired,
  value: PropTypes.any,
};

Widget1SingleInputInput.defaultProps = {
  value: '',
  tabIndex: undefined,
};

export default Widget1SingleInputInput;
