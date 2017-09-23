import PropTypes from 'prop-types';
import React, { Component } from 'react';

import classnames from 'classnames';

import TextField from '/imports/ui/components/general/Material/TextField';
import IconButton from '/imports/ui/components/general/IconButton';
import MaskedInput from 'react-text-mask';
import { swissFrancMask } from '/imports/js/helpers/textMasks';
import constants from '/imports/js/config/constants';
import { trackOncePerSession } from '/imports/js/helpers/analytics';

const primaryColor = '#4A90E2';

const defaultStyle = {
  color: primaryColor,
  borderColor: primaryColor,
  position: 'absolute',
  bottom: -8,
};
const errorStyle = {
  position: 'absolute',
  bottom: -8,
};

// Use class to allow refs and focus to work
export default class Start1Text extends Component {
  render() {
    const {
      name,
      setStateValue,
      auto,
      motionValue,
      value,
      minValue,
    } = this.props;
    return (
      <div className="text-div">
        <TextField
          id={name}
          name={name}
          onChange={(e) => {
            trackOncePerSession(`Start1Text - Used textfield ${name}`);
            setStateValue(name, e.target.value);
          }}
          errorStyle={minValue <= value ? defaultStyle : errorStyle}
          className="input"
          ref={(c) => {
            this.input = c;
          }}
          type="text"
        >
          <MaskedInput
            type="text"
            value={(auto ? Math.round(motionValue) : value) || ''}
            mask={swissFrancMask}
            placeholder={constants.getCurrency()}
            guide={false}
            pattern="[0-9]*"
            showMask={false}
          />
        </TextField>
        <span
          className={classnames({
            reset: true,
            off: value === 0,
          })}
        >
          <IconButton
            type="close"
            onClick={() => {
              setStateValue(name, 0, true);
              this.input.input.inputElement.focus();
            }}
            disabled={value === 0}
          />
        </span>
      </div>
    );
  }
}

Start1Text.propTypes = {
  value: PropTypes.number.isRequired,
  motionValue: PropTypes.number.isRequired,
  setStateValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  minValue: PropTypes.number.isRequired,
  auto: PropTypes.bool.isRequired,
};
