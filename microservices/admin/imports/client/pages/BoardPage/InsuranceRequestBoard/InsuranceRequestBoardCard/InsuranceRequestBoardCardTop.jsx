import React from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import { insuranceRequestUpdateStatus } from 'core/api/methods';

import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import InsuranceRequestBoardCardAssignee from './InsuranceRequestBoardCardAssignee';

const InsuranceRequestBoardCardTop = props => {
  const { insuranceRequest, renderComplex } = props;
  const {
    _id: insuranceRequestId,
    name: insuranceRequestName,
    status,
    assigneeLinks = [],
  } = insuranceRequest;

  return (
    <>
      <div className="left">
        <StatusLabel
          variant="dot"
          status={status}
          collection={INSURANCE_REQUESTS_COLLECTION}
          docId={insuranceRequestId}
          allowModify={renderComplex}
          showTooltip={renderComplex}
          method={nextStatus =>
            insuranceRequestUpdateStatus.run({
              insuranceRequestId,
              status: nextStatus,
            })
          }
        />

        <InsuranceRequestBoardCardAssignee
          renderComplex={renderComplex}
          assigneeLinks={assigneeLinks}
        />

        <CollectionIconLink
          relatedDoc={{
            ...insuranceRequest,
            collection: INSURANCE_REQUESTS_COLLECTION,
          }}
        />
      </div>
    </>
  );
};

export default InsuranceRequestBoardCardTop;
