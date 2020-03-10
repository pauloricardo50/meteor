import React from 'react';
import { Helmet } from 'react-helmet';

import CollectionTasksTable from 'imports/client/components/TasksTable/CollectionTasksTable';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import SingleInsuranceRequestPageContainer from './SingleInsuranceRequestPageContainer';
import SingleInsuranceRequestPageHeader from './SingleInsuranceRequestPageHeader';
import InsuranceRequestTabs from './InsuranceRequestTabs';
import SingleInsuranceRequestPageContacts from './SingleInsuranceRequestPageContacts';

const SingleInsuranceRequestPage = props => {
  const { insuranceRequest } = props;
  return (
    <section className="single-insurance-request-page">
      <Helmet>
        <title>{insuranceRequest.user?.name || insuranceRequest.name}</title>
      </Helmet>
      <SingleInsuranceRequestPageHeader insuranceRequest={insuranceRequest} />
      <div className="single-insurance-request-page-sub-header">
        <CollectionTasksTable
          doc={insuranceRequest}
          collection={INSURANCE_REQUESTS_COLLECTION}
          withTaskInsert
          withQueryTaskInsert
          className="single-insurance-request-page-tasks card1 card-top"
        />
        <SingleInsuranceRequestPageContacts
          insuranceRequestId={insuranceRequest._id}
        />
      </div>
      <InsuranceRequestTabs {...props} />
    </section>
  );
};

export default SingleInsuranceRequestPageContainer(SingleInsuranceRequestPage);
