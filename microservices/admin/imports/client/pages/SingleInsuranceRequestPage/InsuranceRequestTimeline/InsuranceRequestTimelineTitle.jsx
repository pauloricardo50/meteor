import React from 'react';

import TimelineTitle from 'core/components/Timeline/TimelineTitle';
import colors from 'core/config/colors';
import { AdminActivityModifier } from '../../../components/AdminTimeline/AdminActivityAdder';

import { getIcon } from '../../../components/AdminTimeline/AdminTimelineTitle';

const allowModify = (type, isServerGenerated) =>
  !isServerGenerated && type !== 'task';

const InsuranceRequestTimelineTitle = ({
  activity,
  availableDocuments = [],
}) => {
  const {
    date,
    title: activityTitle,
    type,
    isServerGenerated,
    isImportant,
    insuranceRequestLink,
    insuranceLink,
  } = activity;

  let documentName;
  if (insuranceLink) {
    documentName = availableDocuments.find(({ id }) => id === insuranceLink._id)
      .label;
  } else if (insuranceRequestLink) {
    documentName = availableDocuments.find(
      ({ id }) => id === insuranceRequestLink._id,
    ).label;
  }

  const title = `${documentName} - ${activityTitle}`;

  return (
    <TimelineTitle
      title={title}
      icon={getIcon(type, isServerGenerated, isImportant)}
      date={date}
      iconStyle={isImportant ? { color: colors.warning } : {}}
    >
      {allowModify(type, isServerGenerated) && (
        <AdminActivityModifier className="activity-modifier" model={activity} />
      )}
    </TimelineTitle>
  );
};

export default InsuranceRequestTimelineTitle;
