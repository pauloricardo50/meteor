// @flow
import React from 'react';
import omit from 'lodash/omit';

import AutoForm from 'core/components/AutoForm2';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
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
  let message;
  let hideLoader;

  return import('../../../../../core/utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return loanUpdate.run({ loanId, object: omit(doc, grapherLinks) });
    })
    .finally(() => {
      hideLoader();
    })
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
