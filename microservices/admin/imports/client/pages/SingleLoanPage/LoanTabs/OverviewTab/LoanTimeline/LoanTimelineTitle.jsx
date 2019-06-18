// @flow
import React from 'react';
import moment from 'moment';

import { LoanActivityModifier } from './LoanActivityAdder';

type LoanTimelineTitleProps = {};

const LoanTimelineTitle = ({ activity }: LoanTimelineTitleProps) => {
  const { date, title } = activity;

  return (
    <div className="loan-timeline-title">
      <div className="top">
        <h4>{title}</h4>
        <LoanActivityModifier
          className="activity-modifier"
          model={activity}
        />
      </div>
      <h4 className="secondary">
        <small>{moment(date).format("D MMM 'YY")}</small>
      </h4>
    </div>
  );
};

export default LoanTimelineTitle;
