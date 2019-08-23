// @flow
import React from 'react';

import Linkify from 'core/components/Linkify';

type LoanTimelineDescriptionProps = {};

const LoanTimelineDescription = ({
  activity: { description },
}: LoanTimelineDescriptionProps) => (
  <div className="loan-timeline-description">
    <Linkify>{description}</Linkify>
  </div>
);

export default LoanTimelineDescription;
