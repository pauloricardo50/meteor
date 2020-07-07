import React from 'react';

import marker from '../../images/city-marker.svg';
import {
  CITIES_COORDINATES,
  MARKER_FONT_SIZE_FACTOR,
  MARKER_LINE_HEIGHT_FACTOR,
  MARKER_SIZE_FACTOR,
} from './GPSStatsConstants';

const CityMarker = ({ city, mapSize }) => {
  const { zipCode, count, name } = city;
  const { x, y } = CITIES_COORDINATES[zipCode] || {};

  if (!x || !y) {
    return null;
  }
  const size = mapSize * MARKER_SIZE_FACTOR;
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
          fontSize: `${MARKER_FONT_SIZE_FACTOR * size}rem`,
          lineHeight: `${MARKER_LINE_HEIGHT_FACTOR * size}rem`,
        }}
      >
        <b>{count}</b>
      </span>
      <img width={size} height={size} src={marker} alt={name} />
    </div>
  );
};

export default CityMarker;
