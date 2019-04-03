// @flow
import React from 'react';

import T from '../Translation';
import StatusIcon from '../StatusIcon';
import { SUCCESS } from '../../api/constants';

type LoanChecklistListProps = {};

const LoanChecklistList = ({
  ids,
  title,
  intlPrefix,
  labelOverrider,
}: LoanChecklistListProps) => (
  <span className="loan-checklist-list">
    <h4>{title}</h4>
    {ids.length === 0 && (
      <span className="secondary">
        <T id="LoanChecklist.done" />
        <StatusIcon status={SUCCESS} />
      </span>
    )}
    {ids.map((id) => {
      const label = labelOverrider && labelOverrider(id);
      return label ? (
        <span>{label}</span>
      ) : (
        <T id={`${intlPrefix}.${id}`} key={id} />
      );
    })}
  </span>
);

export default LoanChecklistList;
