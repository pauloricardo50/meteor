// @flow
import React from 'react';

import Recap from 'core/components/Recap';
import UpdateField from 'core/components/UpdateField';
import { LOANS_COLLECTION } from 'core/api/constants';
import LoanTimeline from '../LoanTabs/OverviewTab/LoanTimeline';
import StructureForm from './StructureForm';
import LoanAdminNotes from '../LoanTabs/OverviewTab/LoanAdminNotes'

type PremiumOverviewTabProps = {};

const PremiumOverviewTab = (props: PremiumOverviewTabProps) => {
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
      </div>

      <LoanTimeline loanId={loanId} />

      <LoanAdminNotes loan={loan} />

      <div className="structure-form">
        <StructureForm {...props} />
        <Recap {...props} arrayName="premium" />
      </div>
    </div>
  );
};

export default PremiumOverviewTab;
