import React from 'react';
import PropTypes from 'prop-types';

import EventsDay from './EventsDay';

const MixpanelEventList = ({ groupedEvents }) => (
  <ol className="mix-event-list">
    {Object.keys(groupedEvents).map(day =>
      <EventsDay key={day} day={day} events={groupedEvents[day]} />)}
  </ol>
);

MixpanelEventList.propTypes = {
  groupedEvents: PropTypes.object.isRequired,
};

export default MixpanelEventList;
