// @flow
import React from 'react';

import { Money } from 'core/components/Translation';

type LoanBoardCardDescriptionProps = {};

const LoanBoardCardDescription = ({
  structure,
  adminNote,
  selectedLenderOrganisation: { name: selectedLenderOrganisationName } = {},
}: LoanBoardCardDescriptionProps) => (
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

export default LoanBoardCardDescription;
