import React, { useState } from 'react';
import InsuranceRequestBoardCardTop from './InsuranceRequestBoardCardTop';
import InsuranceRequestBoardCardDescription from './InsuranceRequestBoardCardDescription';

const InsuranceRequestBoardCard = ({
  data: insuranceRequest,
  style,
  setInsuranceRequestId,
}) => {
  const [renderComplex, setRenderComplex] = useState(false);

  const { _id: insuranceRequestId, insurances = [] } = insuranceRequest;

  return (
    <div
      className="loan-board-card card1 card-hover animated bounceIn"
      style={style}
      onClick={() => setInsuranceRequestId(insuranceRequestId)}
      onMouseEnter={() => setRenderComplex(true)}
      onMouseLeave={() => setRenderComplex(false)}
    >
      <div className="card-header">
        <InsuranceRequestBoardCardTop
          renderComplex={renderComplex}
          insuranceRequest={insuranceRequest}
        />
      </div>

      <div className="card-top">
        <InsuranceRequestBoardCardDescription insurances={insurances} />
      </div>
    </div>
  );
};

export default InsuranceRequestBoardCard;
