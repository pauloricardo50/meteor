import React from 'react';

import Linkify from '../Linkify';

const TimelineDescription = ({
  activity: { description },
  className = 'timeline-description',
}) => (
  <div className={className}>
    <Linkify>{description}</Linkify>
  </div>
);

export default TimelineDescription;
