import React from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import PremiumBadge from 'core/components/PremiumBadge/PremiumBadge';

import CollectionTasksTable from '../../../components/TasksTable/CollectionTasksTable';
import SingleLoanPageContacts from '../SingleLoanPageContacts';
import SingleLoanPageCustomName from '../SingleLoanPageCustomName';
import SingleLoanPageHeader from '../SingleLoanPageHeader';
import PremiumLoanTabs from './PremiumLoanTabs';

const PremiumSingleLoanPage = props => {
  const { loan } = props;

  return (
    <div className="single-loan-page premium">
      <PremiumBadge />
      <SingleLoanPageHeader
        loan={loan}
        withPdf={false}
        withCustomName={false}
      />
      <SingleLoanPageCustomName
        customName={loan.customName}
        loanId={loan._id}
      />
      <div className="single-loan-page-sub-header">
        <CollectionTasksTable
          doc={loan}
          collection={LOANS_COLLECTION}
          withTaskInsert
          withQueryTaskInsert
          className="single-loan-page-tasks card1 card-top"
        />
        <SingleLoanPageContacts loanId={loan._id} />
      </div>
      <PremiumLoanTabs {...props} />
    </div>
  );
};

export default PremiumSingleLoanPage;
