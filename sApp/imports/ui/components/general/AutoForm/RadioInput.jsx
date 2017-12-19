import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from 'core/api/cleanMethods';

import { T } from 'core/components/Translation';
import RadioButtons from '/imports/ui/components/general/RadioButtons';
import FormValidator from './FormValidator';

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

  // Change radio button group state to appropriate value
  setValue = value => this.setState({ value }, this.saveValue(value));

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

    cleanMethod(this.props.updateFunc, { object, id: this.props.docId });
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
      // relative position for the FormValidator
      <div style={{ ...style, marginBottom: 16, position: 'relative' }}>
        <RadioButtons
          label={label}
          id={id}
          options={options.map(o => ({
            id: o.id,
            label: this.getOptionLabel(o.id, o.intlValues),
          }))}
          onChange={(_, newValue) => {
            onConditionalChange(newValue);
            this.setValue(newValue);
          }}
          value={this.state.value}
          disabled={disabled}
        />
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
  docId: PropTypes.string.isRequired,
  updateFunc: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

RadioInput.defaultProps = {
  currentValue: undefined,
  onConditionalChange: () => null,
  disabled: false,
};
