import React from 'react';

import Recap from 'core/components/Recap';
import UpdateField from 'core/components/UpdateField';
import { LOANS_COLLECTION } from 'core/api/constants';
import AdminNotes from 'core/components/AdminNotes';
import StructureForm from './StructureForm';
import LoanDisbursementDate from '../LoanTabs/OverviewTab/LoanDisbursementDate';
import AssigneesManager from '../../../components/AssigneesManager';
import AdminTimeline from '../../../components/AdminTimeline';

const PremiumOverviewTab = props => {
  const { loan } = props;
  const { _id: loanId, frontTagId } = loan;
  return (
    <div className="premium-overview">
      <div className="card1 card-top top">
        <UpdateField
          doc={loan}
          fields={['category']}
          collection={LOANS_COLLECTION}
        />
        <UpdateField
          doc={loan}
          fields={['residenceType']}
          collection={LOANS_COLLECTION}
        />
        <LoanDisbursementDate loan={loan} />
        <AssigneesManager doc={loan} collection={LOANS_COLLECTION} />
      </div>

      <AdminTimeline
        docId={loanId}
        collection={LOANS_COLLECTION}
        frontTagId={frontTagId}
      />
      <AdminNotes doc={loan} collection={LOANS_COLLECTION} />

      <div className="structure-form">
        <StructureForm {...props} />
        <Recap {...props} arrayName="premium" />
      </div>
    </div>
  );
};

export default PremiumOverviewTab;
