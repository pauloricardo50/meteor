import React from 'react';

import useMedia from 'core/hooks/useMedia';
import useWindowSize from 'core/hooks/useWindowSize';

import useAllGPSStat from '../../hooks/useAllGPSStat';
import map from '../../images/romandy-map.svg';
import CityMarker from './CityMarker';

const LoansMap = () => {
  const isMobile = useMedia({ maxWidth: 768 });
  const { width: windowWidth } = useWindowSize();
  const gpsStats = useAllGPSStat();

  const mapSize = isMobile ? 0.8 * windowWidth : 500;

  return (
    <div className="gps-stats-map" style={{ height: mapSize, width: mapSize }}>
      <img
        style={{ position: 'absolute', top: 0, left: 0 }}
        src={map}
        width={mapSize}
        height={mapSize}
        alt="romandy-map"
      />

      {gpsStats?.length &&
        gpsStats.map((city, index) => (
          <CityMarker
            key={city.zipCode}
            city={city}
            mapSize={mapSize}
            index={index}
          />
        ))}
    </div>
  );
};

export default LoansMap;
