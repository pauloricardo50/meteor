import React from 'react';
import InsuranceRequestBoardInsuranceCard from './InsuranceRequestBoardInsuranceCard';

const InsuranceRequestBoardCardDescription = ({ insurances = [] }) => (
  <>
    {insurances.length ? (
      insurances.map(insurance => (
        <InsuranceRequestBoardInsuranceCard
          insurance={insurance}
          key={insurance._id}
        />
      ))
    ) : (
      <p>Pas encore d'assurance pour ce dossier</p>
    )}
  </>
);

export default InsuranceRequestBoardCardDescription;
