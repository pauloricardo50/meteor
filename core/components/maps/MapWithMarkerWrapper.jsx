import React from 'react';
import PropTypes from 'prop-types';

import MapWithMarker from './MapWithMarker';
import T from '../Translation';
import { getAddressString, isIncompleteAddress } from './googleMapsHelpers';

const MapWithMarkerWrapper = ({
  address1,
  zipCode,
  city,
  options,
  className,
  showIncompleteAddress,
}) => {
  if (isIncompleteAddress({ address1, zipCode, city })) {
    if (!showIncompleteAddress) {
      return null;
    }

    return (
      <p className="description incomplete-address">
        <T id="Maps.incompleteAddress" />
      </p>
    );
  }

  return (
    <MapWithMarker
      address={getAddressString({ address1, zipCode, city })}
      className={`map ${className}`}
      options={options}
    />
  );
};

MapWithMarkerWrapper.propTypes = {
  address1: PropTypes.string,
  city: PropTypes.string,
  options: PropTypes.object,
  showIncompleteAddress: PropTypes.bool,
  zipCode: PropTypes.number,
};

MapWithMarkerWrapper.defaultProps = {
  address1: '',
  city: '',
  showIncompleteAddress: true,
  zipCode: undefined,
  options: { zoom: 10 },
};

export default MapWithMarkerWrapper;
