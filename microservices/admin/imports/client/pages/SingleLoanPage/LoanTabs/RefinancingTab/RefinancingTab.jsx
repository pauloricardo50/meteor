// @flow
import React from 'react';
import omit from 'lodash/omit';

import AutoForm from 'core/components/AutoForm2';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import message from 'core/utils/message';
import { loanUpdate } from 'core/api/loans/index';

type RefinancingTabProps = {};

const grapherLinks = [
  'user',
  'documents',
  'properties',
  'borrowers',
  'promotions',
  'promotionOptions',
  'offers',
];

const handleSubmit = loanId => (doc) => {
  const hideLoader = message.loading('...', 0);
  return loanUpdate
    .run({ loanId, object: omit(doc, grapherLinks) })
    .finally(hideLoader)
    .then(() => message.success('Enregistré', 2));
};

const RefinancingTab = ({ loan }: RefinancingTabProps) => (
  <div className="refinancing-tab">
    <h1>Refinancement</h1>
    <AutoForm
      model={loan}
      schema={LoanSchema.pick(
        'previousLender',
        'previousLoanTranches',
        'mortgageNotes',
      )}
      onSubmit={handleSubmit(loan._id)}
    />
  </div>
);

export default RefinancingTab;
