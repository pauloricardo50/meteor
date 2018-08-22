// @flow
import React from 'react';

import T from '../Translation';

type LoanChecklistDocumentsProps = {};

const LoanChecklistDocuments = ({ ids }: LoanChecklistDocumentsProps) => (
  <div className="loan-checklist-documents">
    {ids.map(id => (
      <T id={`files.${id}`} key={id} />
    ))}
  </div>
);

export default LoanChecklistDocuments;
