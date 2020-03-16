import React from 'react';
import AdminNotes from 'core/components/AdminNotes';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import AssigneesManager from 'imports/client/components/AssigneesManager';
import AdminTimeline from '../../../../components/AdminTimeline';

const OverviewTab = props => {
  const { insuranceRequest } = props;
  const { borrowers, _id: insuranceRequestId } = insuranceRequest;
  console.log('insuranceRequest:', insuranceRequest);

  return (
    <div className="overview-tab">
      <div className="admin-section card1">
        <div className="card-top">
          <AssigneesManager
            doc={insuranceRequest}
            collection={INSURANCE_REQUESTS_COLLECTION}
          />
        </div>
      </div>
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
