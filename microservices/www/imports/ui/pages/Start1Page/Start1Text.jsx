import PropTypes from 'prop-types';
import React, { Component } from 'react';

import classnames from 'classnames';

import IconButton from 'core/components/IconButton';
import { trackOncePerSession } from 'core/utils/analytics';

import TextInput from 'core/components/TextInput';

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
      error,
    } = this.props;

    return (
      <div className="text-div">
        <TextInput
          id={name}
          value={(auto ? Math.round(motionValue) : value) || ''}
          onChange={(_, newValue) => {
            trackOncePerSession(`Start1Text - Used textfield ${name}`);
            setStateValue(name, newValue);
          }}
          inputRef={(c) => {
            this.input = c;
          }}
          type="money"
          className="input"
          error={error}
        />
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
              if (this.input && this.input.inputElement) {
                this.input.inputElement.focus();
              }
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
