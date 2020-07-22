import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import FormattedMessage from 'core/components/Translation/FormattedMessage';

import marker from '../../images/city-marker.svg';
import {
  CITIES_COORDINATES,
  MARKER_COUNT_THRESHOLD,
} from './GPSStatsConstants';

const CityMarker = ({ city, mapSize, index }) => {
  const { zipCode, count, city: cityName } = city;
  const { x, y } = CITIES_COORDINATES[zipCode] || {};

  if (!x || !y || count < MARKER_COUNT_THRESHOLD) {
    return null;
  }
  const size = 50;
  return (
    <Tooltip
      title={
        <div className="flex-col">
          <b className="secondary mb-4">
            <FormattedMessage
              id="cityMarker.title"
              values={{ city: cityName }}
            />
          </b>
          <span className="fs-1">
            <FormattedMessage id="cityMarker.count" values={{ count }} />
          </span>
        </div>
      }
    >
      <div
        style={{
          position: 'absolute',
          top: y * mapSize - size,
          left: x * mapSize,
          animationDelay: `${index * 50}ms`,
        }}
        className="flex center animated fadeInDown"
      >
        <span
          className="m-0"
          style={{
            position: 'absolute',
            top: size / 4,
            fontSize: 11,
            lineHeight: '11px',
          }}
        >
          <b>{count}</b>
        </span>
        <img width={size} height={size} src={marker} alt={cityName} />
      </div>
    </Tooltip>
  );
};

export default CityMarker;
