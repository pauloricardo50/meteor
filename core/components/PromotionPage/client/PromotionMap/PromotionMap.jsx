// @flow
import React from 'react';

import MapWithMarkerWrapper from '../../../maps/MapWithMarkerWrapper';

type PromotionMapProps = {};

const PromotionMap = ({
  promotion: { address1, city, zipCode },
}: PromotionMapProps) => (
  <div className="promotion-page-map">
    <MapWithMarkerWrapper
      address1={address1}
      city={city}
      zipCode={zipCode}
      options={{ zoom: 12 }}
      className="animated fadeIn"
    />
  </div>
);

export default PromotionMap;
