import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { toMoney } from 'core/utils/conversionFunctions';

const Widget1SingleInputInput = ({
  name,
  value,
  setInputValue,
  auto,
  unsetValue,
}) => (
  <div className={classnames('widget1-input', { auto })}>
    {/* Use type tel to display right keyboard without type number issues */}
    <Input
      id={name}
      type="tel"
      value={toMoney(value)}
      onChange={setInputValue}
      startAdornment={
        <InputAdornment position="start">
          <span className="widget1-input-currency">CHF</span>
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            type="close"
            tooltip={<T id="general.erase" />}
            onClick={unsetValue}
          />
        </InputAdornment>
      }
    />
  </div>
);

Widget1SingleInputInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  setInputValue: PropTypes.func.isRequired,
  auto: PropTypes.bool.isRequired,
  unsetValue: PropTypes.func.isRequired,
};

Widget1SingleInputInput.defaultProps = {
  value: '',
};

export default Widget1SingleInputInput;
