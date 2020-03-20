import React from 'react';
import { INSURANCES_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';

const InsuranceRequestBoardInsuranceCard = ({ insurance }) => {
  const { status, name, organisation, insuranceProduct } = insurance;

  return (
    <div className="card1 card-top flex-col mb-8">
      <div className="flex center-align">
        <StatusLabel
          variant="dot"
          status={status}
          collection={INSURANCES_COLLECTION}
        />
        <img src={organisation.logo} width={16} className="ml-4 mr-4" />
        <h4 className="title ml-8">{name}</h4>
      </div>
      <div>
        <h5>{insuranceProduct.name}</h5>
      </div>
    </div>
  );
};

export default InsuranceRequestBoardInsuranceCard;
