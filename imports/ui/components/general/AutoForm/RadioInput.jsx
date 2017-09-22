import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RadioButton from 'material-ui/RadioButton/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';

import { T } from '/imports/ui/components/general/Translation';
import FormValidator from './FormValidator';

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

  getOptionLabel = (optionId, intlValues) => {
    // If the options are true and false, render "yes" and "no" as labels
    if (optionId === true) {
      return <T id="general.yes" values={intlValues} />;
    } else if (optionId === false) {
      return <T id="general.no" values={intlValues} />;
    }
    return (
      <T
        id={`Forms.${this.props.intlId || this.props.id}.${optionId}`}
        values={intlValues}
      />
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
    const {
      id,
      style,
      label,
      onConditionalChange,
      options,
      disabled,
    } = this.props;
    return (
      <div style={{ ...styles.div, ...style }}>
        <label htmlFor={id}>{label}</label>
        <RadioButtonGroup
          name={this.props.id}
          defaultSelected={this.state.value}
          onChange={onConditionalChange}
          style={styles.RadioButtonGroup}
        >
          {options.map(({ id: optionId, intlValues }) => (
            <RadioButton
              label={this.getOptionLabel(optionId, intlValues)}
              value={optionId}
              onClick={this.setValue}
              key={optionId}
              style={styles.RadioButton}
              labelStyle={styles.RadioButtonLabel}
              disabled={disabled}
            />
          ))}
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
