import PropTypes from 'prop-types';
import React, { Component } from 'react';

import T from '../Translation';
import Select from '../Select';
import ValidIcon from './ValidIcon';

export default class AutoFormSelectFieldInput extends Component {
  constructor(props) {
    super(props);

    const {
      inputProps: { defaultValue },
    } = this.props;
    this.state = {
      value: this.props.inputProps.currentValue || defaultValue || '',
      errorText: '',
      saving: false,
    };
  }

  handleChange = value => this.setState({ value }, () => this.saveValue());

  saveValue = () => {
    const {
      inputProps: { id },
      updateFunc,
      docId,
    } = this.props;
    const { value } = this.state;
    const object = { [id]: value };

    updateFunc({ object, id: docId })
      // on success, set saving briefly to true, before setting it to false again to trigger icon
      .then(() => this.setState({ errorText: '', saving: true }))
      .catch(error => this.setState({ errorText: error.message }))
      .finally(() => this.setState({ saving: false }));
  };

  mapOptions = (transform = () => null) =>
    this.props.inputProps.options.map(({ id, intlId, intlValues, label, ref, ...otherProps }) => ({
      label: label || transform(id) || (
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
      inputProps: {
        style,
        label,
        disabled,
        options,
        transform,
        defaultValue,
        id,
        required,
      },
      admin,
    } = this.props;
    const { value, saving, errorText } = this.state;

    const renderedOptions = this.mapOptions(transform);

    return (
      <div className="form-input__row form-select__row">
        <Select
          id={id}
          label={label}
          value={value || ''}
          onChange={this.handleChange}
          disabled={disabled}
          options={renderedOptions}
          fullWidth
        />
        <ValidIcon
          saving={saving}
          error={errorText !== ''}
          value={value}
          required={required}
          hide={admin}
        />
      </div>
    );
  }
}

AutoFormSelectFieldInput.propTypes = {
  currentValue: PropTypes.any,
  docId: PropTypes.string.isRequired,
  inputProps: PropTypes.shape({
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  updateFunc: PropTypes.func.isRequired,
};

AutoFormSelectFieldInput.defaultProps = {
  currentValue: undefined,
};
