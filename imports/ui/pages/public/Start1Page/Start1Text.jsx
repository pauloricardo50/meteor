import PropTypes from 'prop-types';
import React, { Component } from 'react';

import classnames from 'classnames';

import IconButton from '/imports/ui/components/general/IconButton';
import { trackOncePerSession } from '/imports/js/helpers/analytics';

import TextInput from '/imports/ui/components/general/TextInput';

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
          ref={(c) => {
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
