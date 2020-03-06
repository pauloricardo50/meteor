import React from 'react';
import { Helmet } from 'react-helmet';

import SingleInsuranceRequestPageContainer from './SingleInsuranceRequestPageContainer';
import SingleInsuranceRequestPageHeader from './SingleInsuranceRequestPageHeader';

const SingleInsuranceRequestPage = props => {
  const { insuranceRequest } = props;
  return (
    <div className="card1 card-top">
      <Helmet>
        <title>{insuranceRequest.user?.name || insuranceRequest.name}</title>
      </Helmet>
      <SingleInsuranceRequestPageHeader insuranceRequest={insuranceRequest} />
    </div>
  );
};

export default SingleInsuranceRequestPageContainer(SingleInsuranceRequestPage);
