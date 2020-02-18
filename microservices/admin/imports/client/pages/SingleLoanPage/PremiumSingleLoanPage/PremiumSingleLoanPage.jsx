import React from 'react';

import PremiumBadge from 'core/components/PremiumBadge/PremiumBadge';
import { LOANS_COLLECTION } from 'core/api/constants';
import SingleLoanPageHeader from '../SingleLoanPageHeader';
import PremiumLoanTabs from './PremiumLoanTabs';
import SingleLoanPageCustomName from '../SingleLoanPageCustomName';
import CollectionTasksTable from '../../../components/TasksTable/CollectionTasksTable';

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
      <CollectionTasksTable
        doc={loan}
        colllection={LOANS_COLLECTION}
        withTaskInsert
        withQueryTaskInsert
        className="single-loan-page-tasks card1 card-top"
      />
      <PremiumLoanTabs {...props} />
    </div>
  );
};

export default PremiumSingleLoanPage;
