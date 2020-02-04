//      
import React from 'react';

import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import TimelineTitle from 'core/components/Timeline/TimelineTitle';
import colors from 'core/config/colors';
import { LoanActivityModifier } from './LoanActivityAdder';

                                 

const icons = {
  [ACTIVITY_TYPES.EMAIL]: 'mail',
  [ACTIVITY_TYPES.EVENT]: 'event',
  [ACTIVITY_TYPES.OTHER]: 'radioButtonChecked',
  [ACTIVITY_TYPES.PHONE]: 'phone',
  [ACTIVITY_TYPES.MAIL]: 'markunreadMailbox',
  task: 'check',
};

const getIcon = (type, isServerGenerated, isImportant) => {
  if (isImportant) {
    return 'star';
  }
  if (isServerGenerated) {
    return 'computer';
  }

  return icons[type] || 'computer';
};

const allowModify = (type, isServerGenerated) =>
  !isServerGenerated && type !== 'task';

const LoanTimelineTitle = ({ activity }                        ) => {
  const { date, title, type, isServerGenerated, isImportant } = activity;

  return (
    <TimelineTitle
      title={title}
      icon={getIcon(type, isServerGenerated, isImportant)}
      date={date}
      iconStyle={isImportant ? { color: colors.warning } : {}}
    >
      {allowModify(type, isServerGenerated) && (
        <LoanActivityModifier className="activity-modifier" model={activity} />
      )}
    </TimelineTitle>
  );
};

export default LoanTimelineTitle;
