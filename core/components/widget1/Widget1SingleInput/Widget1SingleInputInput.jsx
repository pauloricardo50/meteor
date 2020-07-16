import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import IconButton from '../../IconButton';
import InputAdornment from '../../Material/InputAdornment';
import MoneyInput from '../../MoneyInput';
import T from '../../Translation';

const useStyles = makeStyles(() => ({
  root: {},
  input: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  notchedOutline: {
    borderColor: 'unset',
    borderWidth: 0,
  },
}));

const Widget1SingleInputInput = ({
  name,
  value,
  setInputValue,
  auto,
  unsetValue,
  tabIndex,
}) => {
  const classes = useStyles();

  return (
    <div className={classnames('widget1-input', { auto })}>
      {/* Use type tel to display right keyboard without type number issues */}
      <MoneyInput
        id={name}
        type="tel"
        value={value}
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
              tabIndex={-1}
              size="small"
            />
          </InputAdornment>
        }
        tabIndex={tabIndex}
        classes={classes}
      />
    </div>
  );
};

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
