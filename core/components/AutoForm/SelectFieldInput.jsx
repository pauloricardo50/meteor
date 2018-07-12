import PropTypes from 'prop-types';
import React, { Component } from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import ValidIcon from './ValidIcon';
import FormValidator from './FormValidator';

export default class SelectFieldInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.inputProps.currentValue || '',
      errorText: '',
      saving: false,
    };
  }

  handleChange = (_, value) => {
    this.setState({ value }, () => this.saveValue());
  };

  saveValue = () => {
    const {
      inputProps: { id },
      updateFunc,
      docId,
    } = this.props;
    const { value } = this.state;
    const object = { [id]: value };

    updateFunc({ object, id: docId })
      .then((result) =>
      // on success, set saving briefly to true, before setting it to false again to trigger icon
      {
        this.setState(
          { errorText: '', saving: true },
          this.setState({ saving: false }),
        );
      })
      .catch((error) => {
        this.setState({ saving: false, errorText: error.message });
      });
  };

  mapOptions = () =>
    this.props.inputProps.options.map(({ id, intlId, intlValues, label, ref, ...otherProps }) => ({
      label: label || (
        <T
          id={`Forms.${intlId || this.props.inputProps.id}.${id}`}
          values={intlValues}
        />
      ),
      id,
      ...otherProps,
    }));

  render() {
    const {
      inputProps: { style, label, disabled, options, id, required },
      noValidator,
      admin,
    } = this.props;
    const { value, saving, errorText } = this.state;

    const renderedOptions = this.mapOptions();

    return (
      <div className="form-input__row form-select__row">
        <Select
          id={id}
          label={label}
          value={value || ''}
          onChange={this.handleChange}
          disabled={disabled}
          renderValue={val =>
            renderedOptions.find(option => option.id === val).label
          }
          options={renderedOptions}
        />
        <ValidIcon
          saving={saving}
          error={errorText !== ''}
          value={value}
          required={required}
          hide={admin}
        />
        {!noValidator && <FormValidator {...this.props} />}
      </div>
    );
  }
}

SelectFieldInput.propTypes = {
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  docId: PropTypes.string.isRequired,
  updateFunc: PropTypes.func.isRequired,
  inputProps: PropTypes.shape({
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

SelectFieldInput.defaultProps = {
  currentValue: undefined,
  disabled: false,
};
