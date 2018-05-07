import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLocations } from 'core/utils/APIs';

import ValidIcon from '../AutoForm/ValidIcon';
import FormValidator from '../AutoForm/FormValidator';
import AutoComplete from '../AutoComplete';

const styles = {
  div: {
    position: 'relative',
  },
  savingIcon: {
    top: 0,
    right: -50,
  },
};

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
        .then((array) => {
          if (array && array.length) {
            this.setState({
              data: array.map(city => ({
                value: `${zipCode} ${city}`,
                label: `${zipCode} ${city}`,
              })),
            });
          } else {
            this.setState({
              data: [{ label: '-', value: '-' }],
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
    if (value !== '-') {
      const zipCode = parseInt(value, 10);
      const city = value.slice(5);
      // Set the text input
      this.setState({ searchText: value, isValid: true }, () =>
        this.saveValue(zipCode, city));
    } else {
      this.setState({ searchText: '', isValid: false }, () =>
        this.saveValue(null, ''));
    }
  };

  saveValue = (zipCode = null, city = '') => {
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
      .then(() =>
        // on success, set saving briefly to true,
        // before setting it to false again to trigger icon
        this.setState(
          { errorText: '', saving: true },
          this.setState({ saving: false }),
        ))
      .catch(() => {
        // If there was an error, reset value to the backend value
        this.setState({
          saving: false,
          searchText: this.props.initialValue,
        });
      });
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
      inputProps: { disabled, style, label, placeholder },
      admin,
    } = this.props;

    return (
      <div style={{ ...styles.div, ...style }}>
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
          style={styles.savingIcon}
          error={false}
          // Only show the valid icon when isValid is true
          value={isValid === true ? true : undefined}
          required
          hide={admin}
        />
        <FormValidator {...this.props} />
      </div>
    );
  }
}

ZipAutoComplete.propTypes = {
  savePath: PropTypes.string.isRequired,
  updateFunc: PropTypes.func.isRequired,
  docId: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  inputProps: PropTypes.shape({
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    style: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

ZipAutoComplete.defaultProps = {
  initialValue: '',
};

export default ZipAutoComplete;
