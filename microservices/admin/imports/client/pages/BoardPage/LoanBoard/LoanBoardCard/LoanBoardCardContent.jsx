import React from 'react';

import T, { Money } from 'core/components/Translation';

import { additionalLoanBoardFields } from '../loanBoardHelpers';

export const LoanBoardCardContent = ({ data: loan, additionalFields }) => {
  const hasAdditionalFields = additionalFields.length > 0;

  if (!hasAdditionalFields) {
    return null;
  }

  return (
    <div>
      <hr />

      {additionalFields.map(i => {
        const { format, label, labelId } = additionalLoanBoardFields.find(
          ({ id }) => id === i,
        );

        const value = format(loan);

        return (
          <span key={i} className="flex mb-8">
            <span className="secondary">{label || <T id={labelId} />}:</span>
            &nbsp;
            <span>{value || '-'}</span>
          </span>
        );
      })}
    </div>
  );
};

export const LoanBoardCardContentDescription = ({ data: loan }) => {
  const {
    adminNotes = [],
    selectedStructure,
    structures = [],
    selectedLenderOrganisation: { name: selectedLenderOrganisationName } = {},
  } = loan;
  const structure = structures.find(({ id }) => id === selectedStructure);
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
      {structure && structure.wantedLoan ? (
        <h5 className="flex center-align text-center">
          <small className="secondary">PH:&nbsp;</small>
          <Money value={structure.wantedLoan} />
        </h5>
      ) : (
        <h5 className="secondary">
          <i>Pas de plan financier</i>
        </h5>
      )}
      {selectedLenderOrganisationName && (
        <h5 className="flex center-align text-center">
          <small className="secondary">Prêteur choisi:&nbsp;</small>
          <b>{selectedLenderOrganisationName}</b>
        </h5>
      )}
    </>
  );
};
