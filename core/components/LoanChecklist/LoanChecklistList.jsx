import React from 'react';

import { SUCCESS } from '../../api/constants';
import StatusIcon from '../StatusIcon';
import T from '../Translation';

const LoanChecklistList = ({ labels, title }) => (
  <span className="loan-checklist-list">
    <h4>{title}</h4>
    {labels.length === 0 && (
      <span className="secondary">
        <T defaultMessage="Nous avons tout ce qu'il faut" />
        <StatusIcon status={SUCCESS} />
      </span>
    )}
    {labels.map(l => {
      const { basic } = l;
      let label = l;
      let tooltip;

      if (typeof l === 'object') {
        label = l.label;
        tooltip = l.tooltip;
      }
      return (
        <span key={label}>
          {label}
          {basic && <span className="error">&nbsp;*</span>}
          {tooltip && (
            <>
              <br />
              <span className="secondary">{tooltip}</span>
            </>
          )}
        </span>
      );
    })}
  </span>
);

export default LoanChecklistList;
