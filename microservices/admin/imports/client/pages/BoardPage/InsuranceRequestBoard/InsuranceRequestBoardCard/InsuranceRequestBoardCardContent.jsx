import React from 'react';

import InsuranceRequestBoardInsuranceCard from './InsuranceRequestBoardInsuranceCard';

export const InsuranceRequestBoardCardDescription = ({
  data: insuranceRequest,
}) => {
  const { insurances = [], adminNotes } = insuranceRequest;
  const adminNote = adminNotes[0]?.note;

  return (
    <>
      <div className="admin-note">
        {adminNote ? (
          adminNote.split('\n')[0]
        ) : (
          <i className="secondary">Pas de note</i>
        )}
      </div>
      {insurances.length ? (
        insurances.map(insurance => (
          <InsuranceRequestBoardInsuranceCard
            insurance={insurance}
            key={insurance._id}
          />
        ))
      ) : (
        <div>Pas encore d'assurance pour ce dossier</div>
      )}
    </>
  );
};

export const InsuranceRequestBoardCardContent = () => null;
