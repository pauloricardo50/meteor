// @flow
import React from 'react';

import Timeline from 'core/components/Timeline';
import LoanActivityAdder from './LoanActivityAdder';
import LoanTimelineContainer from './LoanTimelineContainer';
import LoanTimelineTitle from './LoanTimelineTitle';
import LoanTimelineDescription from './LoanTimelineDescription';

type LoanTimelineProps = {};

const LoanTimeline = ({ loanId, activities = [] }: LoanTimelineProps) => (
  <div className="loan-timeline">
    <div className="flex">
      <h2>Événements</h2>
      <LoanActivityAdder loanId={loanId} />
    </div>
    <Timeline
      variant="horizontal"
      events={activities.map(activity => ({
        mainLabel: <LoanTimelineTitle activity={activity} />,
        secondaryLabel: <LoanTimelineDescription activity={activity} />,
      }))}
    />
  </div>
);

export default LoanTimelineContainer(LoanTimeline);
