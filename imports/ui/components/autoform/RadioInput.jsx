import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RadioButton from 'material-ui/RadioButton/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';

import FormValidator from './FormValidator.jsx';

const styles = {
  RadioButtonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  RadioButton: {
    // Required or else the buttons disappear behind the background color..
    // File an issue with material-ui?
    zIndex: 0,
    width: 'auto',
    paddingLeft: '20',
  },
  RadioButtonLabel: {
    whiteSpace: 'nowrap',
  },
  div: {
    marginTop: 10,
    marginBottom: 0,
    position: 'relative',
  },
};

export default class RadioInput extends Component {
  constructor(props) {
    super(props);
    // Set initial state to be the 1st option
    if (this.props.currentValue !== undefined) {
      this.state = { value: this.props.currentValue };
    } else {
      // this.state = { value: this.props.options[0].id };
      this.state = { value: undefined };
    }
  }

  setValue = (event) => {
    // Change radio button group state to appropriate value
    this.setState(
      { value: event.target.value },
      this.saveValue(event.target.value),
    );
  };

  saveValue = (value) => {
    // For radiobuttons, check if I actually want to pass a boolean instead of a String
    // event.target.value is always a String
    let safeValue = value;
    if (value === 'true') {
      safeValue = true;
    } else if (value === 'false') {
      safeValue = false;
    }

    // Save data to DB
    const object = {};
    object[this.props.id] = safeValue;

    cleanMethod(this.props.updateFunc, object, this.props.documentId);
  };

  render() {
    return (
      <div style={{ ...styles.div, ...this.props.style }}>
        <label htmlFor={this.props.id}>
          {this.props.label}
        </label>
        <RadioButtonGroup
          name={this.props.id}
          defaultSelected={this.state.value}
          onChange={this.props.onConditionalChange}
          style={styles.RadioButtonGroup}
        >
          {this.props.options.map(option =>
            (<RadioButton
              label={option.label}
              value={option.id}
              onClick={this.setValue}
              key={option.id}
              style={styles.RadioButton}
              labelStyle={styles.RadioButtonLabel}
              disabled={this.props.disabled}
            />),
          )}
        </RadioButtonGroup>
        <FormValidator {...this.props} />
      </div>
    );
  }
}

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onConditionalChange: PropTypes.func,
  currentValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  documentId: PropTypes.string.isRequired,
  updateFunc: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

RadioInput.defaultProps = {
  currentValue: undefined,
  onConditionalChange: () => null,
  disabled: false,
};
