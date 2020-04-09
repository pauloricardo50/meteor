import React from 'react';

import { formatMessage } from '../../../utils/server/intl';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

const EmailLoanChecklist = ({ labels, title }) => (
  <>
    <LoanChecklistEmailTable
      columns={[
        <h4 className="list-title" key={title}>
          {title}
        </h4>,
      ]}
    />
    {labels.length === 0 && (
      <LoanChecklistEmailTable
        columns={[
          {
            el: <div className="check-mark">&#10003;</div>,
            style: { width: '15px' },
          },
          {
            el: formatMessage({ id: 'LoanChecklist.done' }),
            style: { className: 'secondary' },
          },
        ]}
      />
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
        <LoanChecklistEmailTable
          key={label}
          columns={[
            {
              el: (
                <div className="bullet">
                  <div>&nbsp;</div>
                </div>
              ),
              style: { width: '15px', valign: 'top' },
            },
            {
              el: (
                <span>
                  {label}
                  {basic && <span className="basic">&nbsp;*</span>}
                  {tooltip && (
                    <>
                      <br />
                      <span className="secondary">{tooltip}</span>
                    </>
                  )}
                </span>
              ),
              style: { valign: 'top' },
            },
          ]}
        />
      );
    })}
  </>
);

export default EmailLoanChecklist;
