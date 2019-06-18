// @flow
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Money } from 'core/components/Translation';

type LoanBoardCardDescriptionProps = {};

const LoanBoardCardDescription = ({
  structure,
  adminNote,
}: LoanBoardCardDescriptionProps) => {
  if (adminNote) {
    return (
      <div className="admin-note">
        <ReactMarkdown source={adminNote} />
      </div>
    );
  }

  if (structure && structure.wantedLoan) {
    return (
      <h4 className="wanted-loan">
        <small className="secondary">Prêt hypothécaire</small>
        <Money value={structure.wantedLoan} tag="div" />
      </h4>
    );
  }

  return <h4 className="secondary">Pas d'infos</h4>;
};

export default LoanBoardCardDescription;
