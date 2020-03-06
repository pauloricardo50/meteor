import React from 'react';
import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION } from 'core/api/constants';

const SingleInsuranceRequestPageHeader = ({ insuranceRequest }) => {
  const { user, status, name } = insuranceRequest;
  return (
    <div className="flex-col">
      <div className="flex center-align">
        <h1>{name}</h1>
        <span className="ml-16">{status}</span>
      </div>
      {user && (
        <CollectionIconLink
          relatedDoc={{ ...user, collection: USERS_COLLECTION }}
        />
      )}
    </div>
  );
};

export default SingleInsuranceRequestPageHeader;
