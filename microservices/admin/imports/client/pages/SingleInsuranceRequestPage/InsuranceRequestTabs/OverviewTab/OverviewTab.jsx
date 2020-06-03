import React from 'react';

import { getInsuranceRequestDocuments } from 'core/api/files/documents';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import SingleFileTab from 'core/components/FileTabs/SingleFileTab';

import AssigneesManager from '../../../../components/AssigneesManager';
import InsuranceRequestAdminNotes from '../../InsuranceRequestAdminNotes';
import InsuranceRequestTimeline from '../../InsuranceRequestTimeline';
import InsuranceRequestLinkedLoan from './InsuranceRequestLinkedLoan';
import InsuranceRequestRemover from './InsuranceRequestRemover';

const OverviewTab = props => {
  const { insuranceRequest, currentUser } = props;
  const documentArray = getInsuranceRequestDocuments(
    { id: insuranceRequest._id },
    { doc: insuranceRequest },
  );

  return (
    <div className="overview-tab">
      <InsuranceRequestRemover insuranceRequestId={insuranceRequest._id} />
      <div className="admin-section card1" style={{ alignSelf: 'center' }}>
        <div className="flex center-align p-16 sb">
          <InsuranceRequestLinkedLoan insuranceRequest={insuranceRequest} />
          <AssigneesManager
            doc={insuranceRequest}
            collection={INSURANCE_REQUESTS_COLLECTION}
          />
        </div>
      </div>
      <InsuranceRequestTimeline insuranceRequest={insuranceRequest} />
      <InsuranceRequestAdminNotes
        insuranceRequest={insuranceRequest}
        collection={INSURANCE_REQUESTS_COLLECTION}
      />
      <h3>Documents</h3>
      <SingleFileTab
        doc={insuranceRequest}
        currentUser={currentUser}
        documentArray={documentArray}
        withAdditionalDocAdder={false}
      />
    </div>
  );
};

export default OverviewTab;
