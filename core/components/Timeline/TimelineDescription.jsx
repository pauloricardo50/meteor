// @flow
import React from 'react';

import Linkify from 'core/components/Linkify';

type TimelineDescriptionProps = {};

const TimelineDescription = ({
  activity: { description },
  className = 'timeline-description',
}: TimelineDescriptionProps) => (
  <div className={className}>
    <Linkify>{description}</Linkify>
  </div>
);

export default TimelineDescription;
