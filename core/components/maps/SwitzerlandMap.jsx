// @flow
import React from 'react';

import GoogleMap from './GoogleMap';
import GoogleMapContainer from './GoogleMapContainer';

type SwitzerlandMapProps = {};

const SwitzerlandMap = (props: SwitzerlandMapProps) => (
  <GoogleMap
    latlng={{ lat: 46.7985, lng: 8.2318 }}
    options={{ zoom: 6 }}
    withMarker={false}
  />
);

export default GoogleMapContainer(SwitzerlandMap);
