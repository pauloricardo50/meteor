import React from 'react';
import { CollectionIconLink } from 'core/components/IconLink';
import {
  USERS_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import { insuranceRequestUpdateStatus } from 'core/api/methods/index';

const SingleInsuranceRequestPageHeader = ({ insuranceRequest }) => {
  const {
    user,
    status: insuranceRequestStatus,
    name,
    _id: insuranceRequestId,
  } = insuranceRequest;
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
          <span className="ml-16">
            <StatusLabel
              collection={INSURANCE_REQUESTS_COLLECTION}
              status={insuranceRequestStatus}
              allowModify
              docId={insuranceRequestId}
              method={status =>
                insuranceRequestUpdateStatus.run({ insuranceRequestId, status })
              }
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SingleInsuranceRequestPageHeader;
