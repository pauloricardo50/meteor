// @flow
import React from 'react';

import { Money } from 'core/components/Translation';

type LoanBoardCardDescriptionProps = {};

const LoanBoardCardDescription = ({
  structure,
  adminNote,
}: LoanBoardCardDescriptionProps) => {
  if (adminNote) {
    return <div className="admin-note">{adminNote.split('\n')[0]}</div>;
  }

  if (structure && structure.wantedLoan) {
    return (
      <h5 className="wanted-loan">
        <small className="secondary">Prêt hypothécaire</small>
        <Money value={structure.wantedLoan} tag="div" />
      </h5>
    );
  }

  return <h5 className="secondary text-center">Pas d'infos</h5>;
};

export default LoanBoardCardDescription;
