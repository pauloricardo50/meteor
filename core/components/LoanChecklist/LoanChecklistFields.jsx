// @flow
import React from 'react';

import T from '../Translation';

type LoanChecklistFieldsProps = {};

const LoanChecklistFields = ({ ids }: LoanChecklistFieldsProps) => (
  <div className="loan-checklist-fields">
    {ids.map(id => (
      <T id={`Forms.${id}`} key={id} />
    ))}
  </div>
);

export default LoanChecklistFields;
