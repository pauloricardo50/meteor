import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from '../AutoComplete';
import MenuItem from '/imports/ui/components/general/Material/MenuItem';

import { T } from '/imports/ui/components/general/Translation';
import { getLocations } from '/imports/js/helpers/APIs';
import cleanMethod from '/imports/api/cleanMethods';

import SavingIcon from '/imports/ui/components/general/AutoForm/SavingIcon';

const styles = {
  div: {
    position: 'relative',
  },
  savingIcon: {
    position: 'absolute',
    bottom: 10,
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
    };
  }

  handleChange = searchText => this.setState({ searchText }, this.fetchResults);

  fetchResults = () => {
    const { searchText } = this.state;
    if (searchText && searchText.length >= 4) {
      const zipCode = searchText.slice(0, 4);
      getLocations(zipCode)
        .then((array) => {
          if (array && array.length) {
            this.setState({
              data: array.map(city => ({
                value: `${zipCode} ${city}`,
                label: <MenuItem primaryText={`${zipCode} ${city}`} />,
              })),
            });
          } else {
            this.setState({
              data: [
                {
                  label: (
                    <MenuItem primaryText={<T id="ZipAutoComplete.empty" />} />
                  ),
                  value: '-',
                },
              ],
            });
          }
        })
        .catch(console.log);
    }
  };

  handleSelect = ({ value: result }) => {
    if (result !== '-') {
      const zipCode = parseInt(result, 10);
      const city = result.split(' ')[1];
      this.saveValue(zipCode, city);
    }
  };

  saveValue = (zipCode, city) => {
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

  render() {
    const { searchText, data, saving } = this.state;
    const { disabled, style, label } = this.props;
    return (
      <div style={{ ...styles.div, ...style }}>
        <AutoComplete
          label={label}
          value={searchText}
          placeholder={'ZipAutoComplete.placeholder'}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          suggestions={data}
          // filter={() => true} // show all results, to allow showing an empty result
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
