import React from 'react';
import InsuranceRequestBoardInsuranceCard from './InsuranceRequestBoardInsuranceCard';

const InsuranceRequestBoardCardDescription = ({ insurances = [] }) => (
  <>
    {insurances.map(insurance => (
      <InsuranceRequestBoardInsuranceCard
        insurance={insurance}
        key={insurance._id}
      />
    ))}
  </>
);

export default InsuranceRequestBoardCardDescription;
