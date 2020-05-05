import React from 'react';

import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import StatusLabel from 'core/components/StatusLabel';

const InsuranceRequestBoardInsuranceCard = ({ insurance }) => {
  const { status, organisation, insuranceProduct, _collection } = insurance;

  return (
    <div className="card1 p-4 flex-col mb-4">
      <div className="flex-col">
        <div className="flex center-align nowrap">
          <StatusLabel variant="dot" status={status} collection={_collection} />
          <img
            src={organisation?.logo}
            width={16}
            className="ml-4 mr-4"
            alt={organisation?.name}
          />
          <div className="ellipsis" style={{ width: 210 }}>
            {insuranceProduct?.name}
          </div>
        </div>
        <div className="flex secondary">
          <CollectionIconLink relatedDoc={insurance} />
        </div>
      </div>
    </div>
  );
};

export default InsuranceRequestBoardInsuranceCard;
