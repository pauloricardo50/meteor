import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { IntlDate } from 'core/components/Translation';
import Event from './Event';

const today = moment();
const yesterday = moment().subtract(1, 'day');

const getDayTitle = day => {
  const momentDate = moment(day);

  if (momentDate.isSame(today, 'day')) {
    return "Aujourd'hui";
  }
  if (momentDate.isSame(yesterday, 'day')) {
    return 'Hier';
  }
  return (
    <IntlDate
      value={day}
      month="long"
      year="numeric"
      weekday="long"
      day="2-digit"
    />
  );
};

const EventsDay = ({ day, events }) => {
  const sortedFromLast = [...events].reverse();
  return (
    <li className="events-day">
      <h3>{getDayTitle(day)}</h3>
      <ol>
        {sortedFromLast.map((event, index) => (
          <Event key={index} {...event} />
        ))}
      </ol>
    </li>
  );
};

EventsDay.propTypes = {
  day: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
};

export default EventsDay;
