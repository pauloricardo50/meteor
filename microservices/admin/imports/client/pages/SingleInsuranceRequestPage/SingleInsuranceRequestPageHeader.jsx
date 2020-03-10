import React from 'react';
import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION } from 'core/api/constants';

const SingleInsuranceRequestPageHeader = ({ insuranceRequest }) => {
  const { user, status, name } = insuranceRequest;
  return (
    <div className="single-insurance-request-page-header">
      <div className="left">
        <div className="left-top">
          <h1>{name}</h1>
          {user && (
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
            />
          )}
          <span className="ml-16">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default SingleInsuranceRequestPageHeader;
