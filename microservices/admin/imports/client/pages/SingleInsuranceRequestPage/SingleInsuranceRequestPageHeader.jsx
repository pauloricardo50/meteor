import React from 'react';

import { insuranceRequestUpdateStatus } from 'core/api/insuranceRequests/methodDefinitions';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';

import SingleInsuranceRequestCustomName from './SingleInsuranceRequestCustomName';

const SingleInsuranceRequestPageHeader = ({ insuranceRequest }) => {
  const {
    _collection,
    _id: insuranceRequestId,
    name,
    status: insuranceRequestStatus,
    user,
  } = insuranceRequest;
  return (
    <div className="single-insurance-request-page-header">
      <div className="left">
        <div className="left-top">
          <h1>{name}</h1>
          {user && <CollectionIconLink relatedDoc={user} />}
          <span className="ml-16">
            <StatusLabel
              collection={_collection}
              status={insuranceRequestStatus}
              allowModify
              docId={insuranceRequestId}
              method={status =>
                insuranceRequestUpdateStatus.run({ insuranceRequestId, status })
              }
            />
          </span>
        </div>
        <SingleInsuranceRequestCustomName insuranceRequest={insuranceRequest} />
      </div>
    </div>
  );
};

export default SingleInsuranceRequestPageHeader;
