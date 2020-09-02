import React from 'react';

import { getLoanLinkTitle } from 'core/components/IconLink/collectionIconLinkHelpers';

import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';

export const LoanBoardCardTopLeft = ({ renderComplex, data: loan }) => {
  const { borrowers, name, user } = loan;

  const userId = user?._id;
  const hasUser = !!userId;
  const title = getLoanLinkTitle({ user, name, borrowers });

  return renderComplex ? (
    <LoanBoardCardTitle
      borrowers={borrowers}
      hasUser={hasUser}
      name={name}
      title={title}
      user={user}
    />
  ) : (
    <div className="title font-size-body">
      <span className="title-placeholder">{title}</span>
    </div>
  );
};

export const LoanBoardCardTopRight = ({
  data: loan,
  renderComplex,
  hasRenderedComplexOnce,
}) =>
  renderComplex || hasRenderedComplexOnce ? (
    <LoanBoardCardActions loanId={loan?._id} />
  ) : null;
