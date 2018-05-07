import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { T } from 'core/components/Translation';
import Select from 'core/components/Select';
import ValidIcon from './ValidIcon';
import FormValidator from './FormValidator';

const styles = {
  div: {
    position: 'relative',
  },
  savingIcon: {
    top: 0,
    right: -50,
  },
};

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
    this.props.inputProps.options.map(({ id, intlId, intlValues, label, ...otherProps }) => ({
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

    return (
      <div style={{ ...styles.div, ...style }}>
        <Select
          id={id}
          label={label}
          value={value || ''}
          onChange={this.handleChange}
          style={{ ...style, marginBottom: 8 }}
          disabled={disabled}
          renderValue={val => this.mapOptions().find(o => o.id === val).label}
          options={this.mapOptions()}
        />
        <ValidIcon
          saving={saving}
          error={errorText !== ''}
          style={styles.savingIcon}
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
  updateFunc: PropTypes.string.isRequired,
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
