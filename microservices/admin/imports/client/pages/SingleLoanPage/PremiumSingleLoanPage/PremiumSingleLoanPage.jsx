import React from 'react';

import PremiumBadge from 'core/components/PremiumBadge/PremiumBadge';

import CollectionTasksDataTable from '../../../components/TasksDataTable/CollectionTasksDataTable';
import UnsuccessfulReasonModal from '../../../components/UnsuccessfulReasonModal/UnsuccessfulReasonModal';
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
        <CollectionTasksDataTable
          docId={loan._id}
          collection={loan._collection}
          className="single-loan-page-tasks card1 card-top"
        />
        <SingleLoanPageContacts loan={loan} />
      </div>
      <PremiumLoanTabs {...props} />
      <UnsuccessfulReasonModal loan={loan} />
    </div>
  );
};

export default PremiumSingleLoanPage;
