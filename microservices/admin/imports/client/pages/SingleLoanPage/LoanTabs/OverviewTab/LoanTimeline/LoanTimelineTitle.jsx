// @flow
import React from 'react';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';

import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import Icon from 'core/components/Icon';
import { LoanActivityModifier } from './LoanActivityAdder';

type LoanTimelineTitleProps = {};

const icons = {
  [ACTIVITY_TYPES.EMAIL]: 'mail',
  [ACTIVITY_TYPES.EVENT]: 'event',
  [ACTIVITY_TYPES.OTHER]: 'radioButtonChecked',
  [ACTIVITY_TYPES.PHONE]: 'phone',
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
    <div className="loan-timeline-title">
      {allowModify(type, isServerGenerated) && (
        <LoanActivityModifier className="activity-modifier" model={activity} />
      )}
      <h4 className="title">
        <Icon
          className="icon secondary"
          fontSize="small"
          type={getIcon(type, isServerGenerated)}
        />
        <Tooltip title={title} placement="top-start">
          <span className="text">{title}</span>
        </Tooltip>
      </h4>
      <h4 className="secondary">
        <small>{moment(date).format("D MMM 'YY")}</small>
      </h4>
    </div>
  );
};

export default LoanTimelineTitle;
