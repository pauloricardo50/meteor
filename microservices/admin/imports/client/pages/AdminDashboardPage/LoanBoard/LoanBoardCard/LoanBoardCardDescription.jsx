// @flow
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Money } from 'core/components/Translation';

type LoanBoardCardDescriptionProps = {};

const LoanBoardCardDescription = ({
  structures,
  selectedStructure,
  adminNote,
}: LoanBoardCardDescriptionProps) => {
  const structure = structures.find(({ id }) => id === selectedStructure);

  if (adminNote) {
    return (
      <div className="admin-note">
        <ReactMarkdown source={adminNote} />
      </div>
    );
  }

  if (structure) {
    return (
      <h4 className="wanted-loan">
        {structure.wantedLoan ? (
          <>
            <small className="secondary">Prêt hypothécaire</small>
            <Money value={structure.wantedLoan} tag="div" />
          </>
        ) : (
          <span className="secondary">Pas encore structuré</span>
        )}
      </h4>
    );
  }

  return null;
};

export default LoanBoardCardDescription;
