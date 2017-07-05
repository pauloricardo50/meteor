import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';

import { T } from '/imports/ui/components/general/Translation.jsx';

const defaultStyles = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    border: 'none',
    marginTop: 14,
    padding: 0,
    textAlign: 'center',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: 'none',
    width: '100%',
    zIndex: 9999999,
    overflow: 'visible',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: 0,
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa',
  },
};

export default class GoogleMapsAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = (address) => {
    this.props.handleChange('isValidPlace', false);
    this.setState({ address });
  };

  handleFormSubmit = (event, address) => {
    if (event) {
      event.preventDefault();
    }

    this.props.handleChange('loading', true);
    geocodeByAddress(address || this.state.address)
      .then(results => getLatLng(results[0]))
      .then((latlng) => {
        this.props.handleChange('loading', false);
        this.props.handleChange('isValidPlace', true);
        this.props.handleChange('latlng', latlng);
        this.props.handleChange('address', this.state.address);
      })
      .catch((error) => {
        this.props.handleChange('loading', false);
        this.props.handleChange('isValidPlace', true);
        console.error('Error', error);
      });
  };

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.handleChange,
    };

    return (
      <h2 style={{ width: '100%' }} className="fixed-size">
        <TextField
          floatingLabelText={<T id="GoogleMapsAutocomplete.label" />}
          autoFocus
          floatingLabelFixed
          style={{ width: '100%', fontSize: 'inherit', height: 100 }}
          floatingLabelStyle={{ fontSize: 'initial' }}
        >
          <PlacesAutocomplete
            inputProps={inputProps}
            autocompleteItem={({ formattedSuggestion }) =>
              (<MenuItem
                primaryText={formattedSuggestion.mainText}
                secondaryText={formattedSuggestion.secondaryText}
              />)}
            styles={defaultStyles}
            onSelect={address =>
              this.setState({ address }, this.handleFormSubmit)}
            onEnterKeyDown={address =>
              this.setState({ address }, this.handleFormSubmit)}
            highlightFirstSuggestion
            options={{
              radius: 50000, // 50 km
              types: ['geocode'],
              // Bounds of Switzerland, a rectangle
              bounds: {
                north: 47.8,
                east: 10.48333333,
                south: 45.81666667,
                west: 5.95,
              },
            }}
          />
        </TextField>
      </h2>
    );
  }
}

GoogleMapsAutocomplete.propTypes = {
  handleChange: PropTypes.func.isRequired,
};
