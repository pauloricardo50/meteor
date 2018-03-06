import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Event = ({
  event,
  properties: {
    time,
    $browser: browser,
    $browser_version: browserVersion,
    $city: city,
    $region: region,
    $os: os,
    $current_url: currentUrl,
  },
}) => (
  <li className="event">
    <h4>
      {event}{' '}
      <small className="secondary">
        - {moment.unix(time).format('H:mm:ss')}
      </small>
    </h4>
    <div className="details">
      <span>URL: {currentUrl}</span>
      <span>
        Browser: {browser} v{browserVersion}
      </span>
      <span>
        Location: {city}, {region}
      </span>
      <span>OS: {os}</span>
    </div>
  </li>
);

Event.propTypes = {};

export default Event;
