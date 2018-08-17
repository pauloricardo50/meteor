import React from 'react';
import PropTypes from 'prop-types';

import MapWithMarker from './MapWithMarker';
import T from '../Translation';
import { getAddressString, isIncompleteAddress } from './googleMapsHelpers';

const MapWithMarkerWrapper = ({ address1, zipCode, city, options }) => {
  if (isIncompleteAddress({ address1, zipCode, city })) {
    return (
      <p className="description incomplete-address">
        <T id="PropertiesPage.incompleteAddress" />
      </p>
    );
  }

  return (
    <MapWithMarker
      address={getAddressString({ address1, zipCode, city })}
      className="map"
      options={options}
    />
  );
};

MapWithMarkerWrapper.propTypes = {
  address1: PropTypes.string,
  city: PropTypes.string,
  options: PropTypes.object,
  zipCode: PropTypes.number,
};

MapWithMarkerWrapper.defaultProps = {
  address1: '',
  city: '',
  zipCode: undefined,
  options: { zoom: 10 },
};

export default MapWithMarkerWrapper;
