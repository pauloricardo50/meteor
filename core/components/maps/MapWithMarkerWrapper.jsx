import React from 'react';
import PropTypes from 'prop-types';

import MapWithMarker from 'core/components/maps/MapWithMarker';
import { T } from 'core/components/Translation';
import { getAddressString, isAddressIncomplete } from './googleMapsHelpers';

const MapWithMarkerWrapper = ({ address1, zipCode, city, options }) => {
  const incompleteAddress = isAddressIncomplete({ address1, zipCode, city });

  if (incompleteAddress) {
    return (
      <p className="description incomplete-address">
        <T id="MapWithMarkerWrapper.incompleteAddress" />
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
  zipCode: PropTypes.string,
  options: PropTypes.object,
};

MapWithMarkerWrapper.defaultProps = {
  address1: '',
  city: '',
  zipCode: '',
  options: { zoom: 10 },
};

export default MapWithMarkerWrapper;
