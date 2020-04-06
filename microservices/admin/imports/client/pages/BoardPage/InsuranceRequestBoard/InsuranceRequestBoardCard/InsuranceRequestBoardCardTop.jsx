import React from 'react';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { insuranceRequestUpdateStatus } from 'core/api/insuranceRequests/methodDefinitions';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import StatusLabel from 'core/components/StatusLabel';

import InsuranceRequestBoardCardAssignee from './InsuranceRequestBoardCardAssignee';

const InsuranceRequestBoardCardTop = props => {
  const { insuranceRequest, renderComplex } = props;
  const {
    _id: insuranceRequestId,
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

        <CollectionIconLink relatedDoc={insuranceRequest} />
      </div>
    </>
  );
};

export default InsuranceRequestBoardCardTop;
