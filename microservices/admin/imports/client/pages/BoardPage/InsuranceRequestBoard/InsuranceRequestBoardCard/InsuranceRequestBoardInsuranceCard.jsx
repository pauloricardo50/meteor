import React from 'react';

import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import StatusLabel from 'core/components/StatusLabel';

const InsuranceRequestBoardInsuranceCard = ({ insurance }) => {
  const { status, organisation, insuranceProduct } = insurance;

  return (
    <div className="card1 p-4 flex-col mb-4">
      <div className="flex center-align sb">
        <div className="flex center-align">
          <StatusLabel
            variant="dot"
            status={status}
            collection={INSURANCES_COLLECTION}
          />
          <img
            src={organisation?.logo}
            width={16}
            className="ml-4 mr-4"
            alt={organisation?.name}
          />
          <p>{insuranceProduct?.name}</p>
        </div>
        <CollectionIconLink
          relatedDoc={{ ...insurance, collection: INSURANCES_COLLECTION }}
        />
      </div>
    </div>
  );
};

export default InsuranceRequestBoardInsuranceCard;
