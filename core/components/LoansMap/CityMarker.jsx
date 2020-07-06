import React from 'react';

import { CITIES_COORDINATES } from './loanMapsHelpers';

const sizeFactor = 0.1;
const fontSizeFactor = 1.2 / 100;
const lineHeightFactor = 1.4375 / 100;

const CityMarker = ({ city, mapSize }) => {
  const { zipCode, count, name } = city;
  const { x, y } = CITIES_COORDINATES[zipCode];
  const size = mapSize * sizeFactor;
  return (
    <div
      style={{
        position: 'absolute',
        top: y * mapSize - size,
        left: x * mapSize,
      }}
      className="flex center animated fadeIn"
    >
      <span
        className="m-0"
        style={{
          position: 'absolute',
          top: size / 4,
          fontSize: `${fontSizeFactor * size}rem`,
          lineHeight: `${lineHeightFactor * size}rem`,
        }}
      >
        <b>{count}</b>
      </span>
      <img width={size} height={size} src="/img/city-marker.svg" alt={name} />
    </div>
  );
};

export default CityMarker;
