import PropTypes from 'prop-types';
import React, { Component } from 'react';

import classnames from 'classnames';

import TextField from 'material-ui/TextField';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import MaskedInput from 'react-text-mask';
import { swissFrancMask } from '/imports/js/helpers/textMasks';
import constants from '/imports/js/config/constants';

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
    return (
      <div className="text-div">
        <TextField
          id={this.props.name}
          name={this.props.name}
          onChange={e => this.props.setStateValue(this.props.name, e.target.value)}
          errorStyle={this.props.minValue <= this.props.value ? defaultStyle : errorStyle}
          className="input"
          ref={c => {
            this.input = c;
          }}
          type="text"
        >
          <MaskedInput
            type="text"
            value={(this.props.auto ? Math.round(this.props.motionValue) : this.props.value) || ''}
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
            off: this.props.value === 0,
          })}
        >
          <CloseIcon
            onTouchTap={() => {
              this.props.setStateValue(this.props.name, 0, true);
              this.input.input.inputElement.focus();
            }}
            disabled={this.props.value === 0}
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
