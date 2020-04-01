import React from 'react';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import AssigneesManager from 'imports/client/components/AssigneesManager';
import { getInsuranceRequestDocuments } from 'core/api/files/documents';
import SingleFileTab from 'core/components/FileTabs/SingleFileTab';
import InsuranceRequestAdminNotes from '../../InsuranceRequestAdminNotes';
import InsuranceRequestTimeline from '../../InsuranceRequestTimeline';
import InsuranceRequestLinkedLoan from './InsuranceRequestLinkedLoan';

const OverviewTab = props => {
  const { insuranceRequest, currentUser } = props;

  return (
    <div className="overview-tab">
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
        documentArray={getInsuranceRequestDocuments(
          { id: insuranceRequest._id },
          { doc: insuranceRequest },
        )}
        collection="insuranceRequests"
        withAdditionalDocAdder={false}
      />
    </div>
  );
};

export default OverviewTab;
