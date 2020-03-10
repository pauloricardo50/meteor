import React from 'react';
import AdminNotes from 'core/components/AdminNotes';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import AdminTimeline from '../../../../components/AdminTimeline';

const OverviewTab = props => {
  const { insuranceRequest } = props;
  const { borrowers, _id: insuranceRequestId } = insuranceRequest;

  return (
    <div className="overview-tab">
      <AdminTimeline
        docId={insuranceRequestId}
        collection={INSURANCE_REQUESTS_COLLECTION}
      />
      <AdminNotes
        doc={insuranceRequest}
        collection={INSURANCE_REQUESTS_COLLECTION}
      />
    </div>
  );
};

export default OverviewTab;
