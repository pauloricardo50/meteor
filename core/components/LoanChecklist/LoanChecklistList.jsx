// @flow
import React from 'react';

import T from '../Translation';
import StatusIcon from '../StatusIcon';
import { SUCCESS } from '../../api/constants';

type LoanChecklistListProps = {};

const LoanChecklistList = ({ labels, title }: LoanChecklistListProps) => (
  <span className="loan-checklist-list">
    <h4>{title}</h4>
    {labels.length === 0 && (
      <span className="secondary">
        <T id="LoanChecklist.done" />
        <StatusIcon status={SUCCESS} />
      </span>
    )}
    {labels.map(label => (
      <span key={label}>{label}</span>
    ))}
  </span>
);

export default LoanChecklistList;
