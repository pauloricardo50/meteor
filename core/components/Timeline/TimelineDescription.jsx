import React from 'react';

import Linkify from 'core/components/Linkify';

const TimelineDescription = ({
  activity: { description },
  className = 'timeline-description',
}) => (
  <div className={className}>
    <Linkify>{description}</Linkify>
  </div>
);

export default TimelineDescription;
