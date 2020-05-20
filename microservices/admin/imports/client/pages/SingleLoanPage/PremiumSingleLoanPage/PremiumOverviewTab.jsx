import React from 'react';

import Loans from 'core/api/loans';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import AdminNotes from 'core/components/AdminNotes';
import Recap from 'core/components/Recap';
import UpdateField from 'core/components/UpdateField';

import AdminTimeline from '../../../components/AdminTimeline';
import AssigneesManager from '../../../components/AssigneesManager';
import LoanDisbursementDate from '../LoanTabs/OverviewTab/LoanDisbursementDate';
import StructureForm from './StructureForm';

const PremiumOverviewTab = props => {
  const { loan } = props;
  const { _id: loanId, frontTagId, status } = loan;
  return (
    <div className="premium-overview">
      <div className="card1 card-top top">
        {status === LOAN_STATUS.UNSUCCESSFUL && (
          <UpdateField
            doc={loan}
            collection={Loans}
            fields={['unsuccessfulReason']}
            autosaveDelay={500}
          />
        )}
        <UpdateField doc={loan} fields={['category']} collection={Loans} />
        <UpdateField doc={loan} fields={['residenceType']} collection={Loans} />
        <LoanDisbursementDate loan={loan} />
        <AssigneesManager doc={loan} collection={LOANS_COLLECTION} />
      </div>

      <AdminTimeline
        docId={loanId}
        collection={LOANS_COLLECTION}
        frontTagId={frontTagId}
      />
      <AdminNotes doc={loan} />

      <div className="structure-form">
        <StructureForm {...props} />
        <Recap {...props} arrayName="premium" />
      </div>
    </div>
  );
};

export default PremiumOverviewTab;
