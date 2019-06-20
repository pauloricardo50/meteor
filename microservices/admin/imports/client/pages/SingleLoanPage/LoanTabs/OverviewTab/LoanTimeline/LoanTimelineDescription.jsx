// @flow
import React from 'react';

type LoanTimelineDescriptionProps = {};

const LoanTimelineDescription = ({
  activity: { description },
}: LoanTimelineDescriptionProps) => (
  <div className="loan-timeline-description">{description}</div>
);

export default LoanTimelineDescription;
