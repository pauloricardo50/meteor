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
  [ACTIVITY_TYPES.SERVER]: 'computer',
};

const LoanTimelineTitle = ({ activity }: LoanTimelineTitleProps) => {
  const { date, title, type } = activity;

  return (
    <div className="loan-timeline-title">
      {type !== ACTIVITY_TYPES.SERVER && (
        <LoanActivityModifier className="activity-modifier" model={activity} />
      )}
      <h4 className="title">
        <Icon className="icon secondary" fontSize="small" type={icons[type]} />
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
