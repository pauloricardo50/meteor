import React from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import getRefinancingFormArray from 'core/arrays/RefinancingFormArray';
import AutoForm from 'core/components/AutoForm';

const RefinancingTab = ({ loan }) => (
  <div className="refinancing-tab">
    <h1>Refinancement</h1>
    <AutoForm
      formClasses="user-form user-form__info"
      inputs={getRefinancingFormArray({ loan })}
      collection={LOANS_COLLECTION}
      doc={loan}
      docId={loan._id}
    />
  </div>
);

export default RefinancingTab;
