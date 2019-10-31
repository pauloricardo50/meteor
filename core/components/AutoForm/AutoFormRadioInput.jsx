import PropTypes from 'prop-types';
import React, { Component } from 'react';

import T from '../Translation';
import RadioButtons from '../RadioButtons';
import ValidIcon from './ValidIcon';

export default class AutoFormRadioInput extends Component {
  constructor(props) {
    super(props);
    // Set initial state to be the 1st option
    if (this.props.inputProps.currentValue !== undefined) {
      this.state = { value: this.props.inputProps.currentValue };
    } else {
      // this.state = { value: this.props.options[0].id };
      this.state = { value: undefined, saving: false };
    }
  }

  // Change radio button group state to appropriate value
  setValue = value => this.setState({ value }, this.saveValue(value));

  getOptionLabel = (optionId, intlValues) => {
    // If the options are true and false, render "yes" and "no" as labels
    if (optionId === true) {
      return <T id="general.yes" values={intlValues} />;
    }
    if (optionId === false) {
      return <T id="general.no" values={intlValues} />;
    }
    return (
      <T
        id={`Forms.${this.props.inputProps.intlId
          || this.props.inputProps.id}.${optionId}`}
        values={intlValues}
      />
    );
  };

  saveValue = (value) => {
    this.setState({ saving: true });
    // For radiobuttons, check if I actually want to pass a boolean instead of a String
    // event.target.value is always a String
    let safeValue = value;
    if (value === 'true') {
      safeValue = true;
    } else if (value === 'false') {
      safeValue = false;
    }

    // Save data to DB
    const object = { [this.props.inputProps.id]: safeValue };
    this.props
      .updateFunc({ object, id: this.props.docId })
      .finally(() => this.setState({ saving: false }));
  };

  render() {
    const {
      inputProps: {
        id,
        style,
        label,
        onConditionalChange,
        options,
        disabled,
        required,
      },
      admin,
    } = this.props;
    const { value, saving } = this.state;

    return (
      // relative position for the FormValidator
      <div
        className="form-radio__row"
        style={{ ...style, marginBottom: 16, position: 'relative' }}
      >
        <RadioButtons
          label={label}
          id={id}
          options={options.map(o => ({
            id: o.id,
            label: this.getOptionLabel(o.id, o.intlValues),
          }))}
          onChange={(newValue) => {
            if (typeof onConditionalChange === 'function') {
              onConditionalChange(newValue);
            }
            this.setValue(newValue);
          }}
          value={value}
          disabled={disabled}
        />
        <ValidIcon
          saving={saving}
          value={value}
          required={required}
          hide={admin}
        />
      </div>
    );
  }
}

AutoFormRadioInput.propTypes = {
  currentValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  docId: PropTypes.string.isRequired,
  inputProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    disabled: PropTypes.bool,
  }).isRequired,
  onConditionalChange: PropTypes.func,
  updateFunc: PropTypes.func.isRequired,
};

AutoFormRadioInput.defaultProps = {
  currentValue: undefined,
  onConditionalChange: () => null,
};
