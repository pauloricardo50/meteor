// @flow
import React from 'react';

import { formatMessage } from 'core/utils/server/intl';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

type EmailLoanChecklistProps = {};

const EmailLoanChecklist = ({ labels, title }: EmailLoanChecklistProps) => (
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
    {labels.map(label => (
      <LoanChecklistEmailTable
        key={label}
        columns={[
          {
            el: (
              <div className="bullet">
                <div>&nbsp;</div>
              </div>
            ),
            style: { width: '15px' },
          },
          label,
        ]}
      />
    ))}
  </>
);

export default EmailLoanChecklist;
