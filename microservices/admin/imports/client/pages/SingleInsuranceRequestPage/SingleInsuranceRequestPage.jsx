import React from 'react';
import { Helmet } from 'react-helmet';

import SingleInsuranceRequestPageContainer from './SingleInsuranceRequestPageContainer';
import SingleInsuranceRequestPageHeader from './SingleInsuranceRequestPageHeader';
import InsuranceRequestTabs from './InsuranceRequestTabs';
import SingleInsuranceRequestPageContacts from './SingleInsuranceRequestPageContacts';
import InsuranceRequestTasksTable from './InsuranceRequestTasksTable/InsuranceRequestTasksTable';

const SingleInsuranceRequestPage = props => {
  const { insuranceRequest } = props;
  return (
    <section className="single-insurance-request-page">
      <Helmet>
        <title>{insuranceRequest.user?.name || insuranceRequest.name}</title>
      </Helmet>
      <SingleInsuranceRequestPageHeader insuranceRequest={insuranceRequest} />
      <div className="single-insurance-request-page-sub-header">
        <InsuranceRequestTasksTable
          doc={insuranceRequest}
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
