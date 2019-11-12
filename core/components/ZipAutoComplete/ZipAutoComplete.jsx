import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLocations } from 'core/utils/APIs';

import ValidIcon from '../AutoForm/ValidIcon';
import AutoComplete from '../AutoComplete';

const styles = {
  div: {
    position: 'relative',
  },
};

const NOT_FOUND_VALUE = '-';

class ZipAutoComplete extends Component {
  constructor(props) {
    super();
    this.state = {
      searchText: props.initialValue || '',
      data: [],
      saving: false,
      isValid: !!props.initialValue,
    };
  }

  // Has to be done via event to accomodate react-autosuggest
  handleChange = event =>
    this.setState(
      {
        searchText: event.target.value,
        isValid: event.target.value === this.state.searchText,
      },
      this.fetchResults,
    );

  fetchResults = () => {
    const { searchText } = this.state;
    const zipCode = searchText.slice(0, 4);

    if (zipCode && zipCode.length === 4) {
      getLocations(zipCode)
        .then(array => {
          if (array && array.length) {
            this.setState({
              data: array.map(city => ({
                value: `${zipCode} ${city}`,
                label: `${zipCode} ${city}`,
              })),
            });
          } else {
            this.setState({
              data: [{ label: NOT_FOUND_VALUE, value: NOT_FOUND_VALUE }],
            });
          }
        })
        .catch(console.log);
    } else {
      // Remove data, and save undefined values to DB if the input is empty
      this.setState(
        { data: [], isValid: false },
        () => !searchText && this.saveValue(),
      );
    }
  };

  handleSelect = ({ value }) => {
    if (value !== NOT_FOUND_VALUE) {
      const zipCode = parseInt(value, 10);
      const city = value.slice(5);
      // Set the text input
      this.setState({ searchText: value, isValid: true }, () =>
        this.saveValue(zipCode, city),
      );
    } else {
      this.setState({ searchText: '', isValid: false }, () =>
        this.saveValue(null, ''),
      );
    }
  };

  saveValue = (zipCode, city) => {
    // Avoid MS Edge issue: https://github.com/babel/babel/issues/8759#issuecomment-423995454
    if (!zipCode) {
      zipCode = null;
    }
    if (!city) {
      city = '';
    }

    const {
      updateFunc,
      docId,
      inputProps: {
        componentProps: { savePath },
      },
    } = this.props;

    // Save data to DB
    const object = {
      [`${savePath}zipCode`]: zipCode,
      [`${savePath}city`]: city,
    };

    updateFunc({ object, id: docId })
      // on success, set saving briefly to true,
      // before setting it to false again to trigger icon
      .then(() => this.setState({ errorText: '', saving: true }))
      // If there was an error, reset value to the backend value
      .catch(() => this.setState({ searchText: this.props.initialValue }))
      .finally(() => this.setState({ saving: false }));
  };

  handleBlur = () => {
    // If the user enters random stuff in the input and blurs it out, remove
    // content and save undefined values to DB
    if (!this.state.isValid) {
      this.setState({ searchText: '' }, this.saveValue);
    }
  };

  render() {
    const { searchText, data, saving, isValid } = this.state;
    const {
      inputProps: { disabled, style, label, placeholder, required },
      admin,
    } = this.props;

    return (
      <div className="form-input__row" style={{ ...styles.div, ...style }}>
        <AutoComplete
          id="ZipAutoComplete"
          label={label}
          value={searchText}
          placeholder={placeholder}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onBlur={this.handleBlur}
          suggestions={data}
          disabled={disabled}
          textFieldStyle={style}
          style={style}
        />
        <ValidIcon
          saving={saving}
          error={false}
          // Only show the valid icon when isValid is true
          value={isValid === true ? true : undefined}
          required={required}
          hide={admin}
        />
      </div>
    );
  }
}

ZipAutoComplete.propTypes = {
  docId: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  inputProps: PropTypes.shape({
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    style: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
  savePath: PropTypes.string.isRequired,
  updateFunc: PropTypes.func.isRequired,
};

ZipAutoComplete.defaultProps = {
  initialValue: '',
};

export default ZipAutoComplete;
