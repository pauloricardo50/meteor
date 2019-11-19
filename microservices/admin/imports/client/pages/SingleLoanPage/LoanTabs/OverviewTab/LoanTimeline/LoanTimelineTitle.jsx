// @flow
import React from 'react';

import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import TimelineTitle from 'core/components/Timeline/TimelineTitle';
import { LoanActivityModifier } from './LoanActivityAdder';

type LoanTimelineTitleProps = {};

const icons = {
  [ACTIVITY_TYPES.EMAIL]: 'mail',
  [ACTIVITY_TYPES.EVENT]: 'event',
  [ACTIVITY_TYPES.OTHER]: 'radioButtonChecked',
  [ACTIVITY_TYPES.PHONE]: 'phone',
  [ACTIVITY_TYPES.MAIL]: 'markunreadMailbox',
  task: 'check',
};

const getIcon = (type, isServerGenerated) => {
  if (isServerGenerated) {
    return 'computer';
  }

  return icons[type] || 'computer';
};

const allowModify = (type, isServerGenerated) =>
  !isServerGenerated && type !== 'task';

const LoanTimelineTitle = ({ activity }: LoanTimelineTitleProps) => {
  const { date, title, type, isServerGenerated } = activity;

  return (
    <TimelineTitle
      title={title}
      icon={getIcon(type, isServerGenerated)}
      date={date}
    >
      {allowModify(type, isServerGenerated) && (
        <LoanActivityModifier className="activity-modifier" model={activity} />
      )}
    </TimelineTitle>
  );
};

export default LoanTimelineTitle;
