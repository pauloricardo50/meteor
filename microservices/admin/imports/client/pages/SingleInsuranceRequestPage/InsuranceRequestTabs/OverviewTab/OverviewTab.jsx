import React from 'react';
import AdminNotes from 'core/components/AdminNotes';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';

const OverviewTab = props => {
  const { insuranceRequest } = props;
  const { borrowers, _id: insuranceRequestId } = insuranceRequest;

  return (
    <div className="overview-tab">
      <AdminNotes
        doc={insuranceRequest}
        collection={INSURANCE_REQUESTS_COLLECTION}
      />
    </div>
  );
};

export default OverviewTab;
