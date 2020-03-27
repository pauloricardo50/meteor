import React from 'react';
import { INSURANCES_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

const InsuranceRequestBoardInsuranceCard = ({ insurance }) => {
  const { status, name, organisation, insuranceProduct } = insurance;

  return (
    <div className="card1 p-4 flex-col mb-4">
      <div className="flex center-align sb">
        <div className="flex center-align">
          <StatusLabel
            variant="dot"
            status={status}
            collection={INSURANCES_COLLECTION}
          />
          <img src={organisation.logo} width={16} className="ml-4 mr-4" />
          <p>{insuranceProduct.name}</p>
        </div>
        <CollectionIconLink
          relatedDoc={{ ...insurance, collection: INSURANCES_COLLECTION }}
        />
        {/* <h4 className="title ml-8">{name}</h4> */}
      </div>
    </div>
  );
};

export default InsuranceRequestBoardInsuranceCard;
