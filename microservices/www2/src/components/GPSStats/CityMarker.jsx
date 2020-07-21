import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import FormattedMessage from 'core/components/Translation/FormattedMessage';
import useMedia from 'core/hooks/useMedia';

import marker from '../../images/city-marker.svg';
import {
  CITIES_COORDINATES,
  MARKER_COUNT_THRESHOLD,
  MARKER_FONT_SIZE_FACTOR,
  MARKER_LINE_HEIGHT_FACTOR,
  MARKER_MOBILE_SIZE_FACTOR,
  MARKER_SIZE_FACTOR,
} from './GPSStatsConstants';

const CityMarker = ({ city, mapSize, index }) => {
  const isMobile = useMedia({ maxWidth: 768 });
  const { zipCode, count, city: cityName } = city;
  const { x, y } = CITIES_COORDINATES[zipCode] || {};

  if (!x || !y || count < MARKER_COUNT_THRESHOLD) {
    return null;
  }
  const size =
    mapSize * (isMobile ? MARKER_MOBILE_SIZE_FACTOR : MARKER_SIZE_FACTOR);
  return (
    <Tooltip
      title={
        <div className="flex-col">
          <b className="secondary font-size-5 mb-4">
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
            fontSize: `${MARKER_FONT_SIZE_FACTOR * size}rem`,
            lineHeight: `${MARKER_LINE_HEIGHT_FACTOR * size}rem`,
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
