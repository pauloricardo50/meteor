import React from 'react';
import InsuranceRequestAdder from '../InsuranceRequestAdder';
import InsuranceRequestSummary from './InsuranceRequestSummary';

const InsuranceRequestsSummaryList = ({
  insuranceRequests = [],
  user,
  loan,
}) => (
  <div className="mt-32">
    <h3>
      Dossiers assurance
      <InsuranceRequestAdder user={user} loan={loan} />
    </h3>
    {insuranceRequests.map(insuranceRequest => (
      <InsuranceRequestSummary
        key={insuranceRequest._id}
        insuranceRequest={insuranceRequest}
      />
    ))}
  </div>
);
export default InsuranceRequestsSummaryList;
