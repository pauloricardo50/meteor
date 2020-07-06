import React from 'react';

import { CollectionIconLink } from 'core/components/IconLink';

import InsuranceRequestStatusModifier from './InsuranceRequestStatusModifier';
import SingleInsuranceRequestCustomName from './SingleInsuranceRequestCustomName';

const SingleInsuranceRequestPageHeader = ({ insuranceRequest }) => {
  const { name, user } = insuranceRequest;
  return (
    <div className="single-insurance-request-page-header">
      <div className="left">
        <div className="left-top">
          <h1>{name}</h1>
          {user && <CollectionIconLink relatedDoc={user} />}
          <span className="ml-16">
            <InsuranceRequestStatusModifier
              insuranceRequest={insuranceRequest}
            />
          </span>
        </div>
        <SingleInsuranceRequestCustomName insuranceRequest={insuranceRequest} />
      </div>
    </div>
  );
};

export default SingleInsuranceRequestPageHeader;
