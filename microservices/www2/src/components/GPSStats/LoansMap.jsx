import React, { useEffect, useState } from 'react';

import useMedia from 'core/hooks/useMedia';

import useAllGPSStat from '../../hooks/useAllGPSStat';
import map from '../../images/romandy-map.svg';
import CityMarker from './CityMarker';

const LoansMap = () => {
  const isMobile = useMedia({ maxWidth: 768 });
  const gpsStats = useAllGPSStat();

  const mapSize = isMobile ? 250 : 500;

  return (
    <>
      <img
        style={{ position: 'absolute', top: 0, left: 0 }}
        src={map}
        width={mapSize}
        height={mapSize}
        alt="romandy-map"
      />

      {gpsStats?.length &&
        gpsStats.map(city => (
          <CityMarker key={city.zipCode} city={city} mapSize={mapSize} />
        ))}
    </>
  );
};

export default LoansMap;
