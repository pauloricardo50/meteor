import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MenuItem } from 'material-ui/Menu';

import { T } from 'core/components/Translation';
import { getLocations } from '/imports/js/helpers/APIs';
import cleanMethod from '/imports/api/cleanMethods';

import SavingIcon from '/imports/ui/components/general/AutoForm/SavingIcon';
import AutoComplete from '../AutoComplete';

const styles = {
  div: {
    position: 'relative',
  },
  savingIcon: {
    position: 'absolute',
    top: 16,
    right: -25,
  },
};

class ZipAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: this.props.initialValue,
      data: [],
      saving: false,
      isValid: false,
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
              data: [
                {
                  label: '-',
                  value: '-',
                },
              ],
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
        this.saveValue(zipCode, city),
      );
    }
  };

  saveValue = (zipCode = null, city = '') => {
    const { updateFunc, docId, savePath } = this.props;

    // Save data to DB
    const object = {
      [`${savePath}zipCode`]: zipCode,
      [`${savePath}city`]: city,
    };

    cleanMethod(updateFunc, object, docId)
      .then(() =>
        // on success, set saving briefly to true,
        // before setting it to false again to trigger icon
        this.setState(
          { errorText: '', saving: true },
          this.setState({ saving: false }),
        ),
      )
      .catch(() => {
        // If there was an error, reset value to the backend value
        this.setState({ saving: false, searchText: this.props.initialValue });
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
    const { searchText, data, saving } = this.state;
    const { disabled, style, label } = this.props;
    return (
      <div style={{ ...styles.div, ...style }}>
        <AutoComplete
          id="ZipAutoComplete"
          label={label}
          value={searchText}
          placeholder="ZipAutoComplete.placeholder"
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onBlur={this.handleBlur}
          suggestions={data}
          disabled={disabled}
          textFieldStyle={style}
          style={style}
        />
        <SavingIcon
          saving={saving}
          style={styles.savingIcon}
          errorExists={false}
        />
      </div>
    );
  }
}

ZipAutoComplete.propTypes = {
  label: PropTypes.node.isRequired,
  savePath: PropTypes.string.isRequired,
  updateFunc: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
};

ZipAutoComplete.defaultProps = {
  initialValue: '',
  disabled: false,
  style: {},
};

export default ZipAutoComplete;
