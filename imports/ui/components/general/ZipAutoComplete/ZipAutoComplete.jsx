import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

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
      dataSource: [],
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
              dataSource: array.map(city => ({
                text: `${zipCode} ${city}`,
                value: <MenuItem primaryText={`${zipCode} ${city}`} />,
              })),
            });
          } else {
            this.setState({
              dataSource: [
                {
                  value: (
                    <MenuItem primaryText={<T id="ZipAutoComplete.empty" />} />
                  ),
                  text: '-',
                },
              ],
            });
          }
        })
        .catch(console.log);
    }
  };

  handleSelect = ({ text: result }) => {
    if (result !== '-') {
      const zipCode = parseInt(result, 10);
      const city = result.split(' ')[1];
      this.saveValue(zipCode, city);
    }
  };

  saveValue = (zipCode, city) => {
    const { updateFunc, documentId, savePath } = this.props;

    // Save data to DB
    const object = {
      [`${savePath}zipCode`]: zipCode,
      [`${savePath}city`]: city,
    };

    cleanMethod(updateFunc, object, documentId)
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
    const { searchText, dataSource, saving } = this.state;
    const { disabled, style, label } = this.props;
    return (
      <div style={{ ...styles.div, ...style }}>
        <AutoComplete
          floatingLabelText={label}
          searchText={searchText}
          hintText={<T id="ZipAutoComplete.placeholder" />}
          onUpdateInput={this.handleChange}
          onNewRequest={this.handleSelect}
          dataSource={dataSource}
          filter={() => true} // show all results, to allow showing an empty result
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
  documentId: PropTypes.string.isRequired,
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
