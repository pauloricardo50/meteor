// @flow
import React from 'react';

import { Money } from 'core/components/Translation';

type LoanBoardCardDescriptionProps = {};

const LoanBoardCardDescription = ({
  structure,
  adminNote,
}: LoanBoardCardDescriptionProps) => {
  return (
    <>
      <div className="admin-note">
        {adminNote ? adminNote.split('\n')[0] : 'Pas de note'}
      </div>
      {structure && structure.wantedLoan ? (
        <h5 className="flex center-align text-center">
          <small className="secondary">PH:&nbsp;</small>
          <Money value={structure.wantedLoan} />
        </h5>
      ) : (
        <h5 className="secondary">Pas de plan financier</h5>
      )}
    </>
  );
};

export default LoanBoardCardDescription;
