import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { compose, withProps, withState } from 'recompose';

import GoogleMapContainer from '../maps/GoogleMapContainer';
import GoogleMapsAutocompleteInput from './GoogleMapsAutocompleteInput';

// Bounds of Switzerland, a rectangle
const SWITZERLAND_RECTANGLE = {
  north: 47.8,
  east: 10.48333333,
  south: 45.81666667,
  west: 5.95,
};

const GoogleMapsAutocomplete = ({ address, handleSelect, changeAddress }) => (
  <PlacesAutocomplete
    value={address}
    onChange={changeAddress}
    onSelect={handleSelect}
    highlightFirstSuggestion
    searchOptions={{ types: ['address'], bounds: SWITZERLAND_RECTANGLE }}
  >
    {autocompleteProps => (
      <GoogleMapsAutocompleteInput {...autocompleteProps} />
    )}
  </PlacesAutocomplete>
);

export default compose(
  GoogleMapContainer,
  withState('address', 'changeAddress', ''),
  withProps(({ changeAddress }) => ({
    handleSelect: address => {
      changeAddress(address);
      geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(latLng => console.log('Success', latLng))
        .catch(error => console.error('Error', error));
    },
  })),
)(GoogleMapsAutocomplete);
