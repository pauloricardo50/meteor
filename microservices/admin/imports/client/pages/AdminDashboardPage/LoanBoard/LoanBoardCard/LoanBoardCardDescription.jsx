// @flow
import React from 'react';

import { Money } from 'core/components/Translation';

type LoanBoardCardDescriptionProps = {};

const LoanBoardCardDescription = ({
  structures,
  selectedStructure,
}: LoanBoardCardDescriptionProps) => {
  const structure = structures.find(({ id }) => id === selectedStructure);

  if (structure) {
    return (
      <h4 className="wanted-loan">
        {structure.wantedLoan ? (
          <Money value={structure.wantedLoan} />
        ) : (
          <span className="secondary">Pas encore structuré</span>
        )}
      </h4>
    );
  }

  return <div>Hello from LoanBoardCardDescription</div>;
};

export default LoanBoardCardDescription;
