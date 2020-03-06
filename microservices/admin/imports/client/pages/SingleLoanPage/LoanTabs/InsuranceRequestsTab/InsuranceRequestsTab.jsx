import React from 'react';
import InsuranceRequestsSummaryList from '../../../../components/InsuranceRequestsSummaryList/InsuranceRequestsSummaryList';

const InsuranceRequestsTab = ({ loan }) => {
  const { insuranceRequests = [] } = loan;
  console.log('loan:', loan);
  return (
    <InsuranceRequestsSummaryList
      insuranceRequests={insuranceRequests}
      loan={loan}
    />
  );
};

export default InsuranceRequestsTab;
