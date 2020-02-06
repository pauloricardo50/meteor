import React from 'react';

import Recap from 'core/components/Recap';
import UpdateField from 'core/components/UpdateField';
import { LOANS_COLLECTION } from 'core/api/constants';
import LoanNotes from 'core/components/LoanNotes';
import LoanTimeline from '../LoanTabs/OverviewTab/LoanTimeline';
import StructureForm from './StructureForm';
import LoanDisbursementDate from '../LoanTabs/OverviewTab/LoanDisbursementDate';
import LoanAssigneeManager from '../../../components/LoanAssigneeManager';

const PremiumOverviewTab = props => {
  const { loan } = props;
  const { _id: loanId } = loan;
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
        <LoanAssigneeManager loan={loan} />
      </div>

      <LoanTimeline loanId={loanId} />
      <LoanNotes loan={loan} />

      <div className="structure-form">
        <StructureForm {...props} />
        <Recap {...props} arrayName="premium" />
      </div>
    </div>
  );
};

export default PremiumOverviewTab;
