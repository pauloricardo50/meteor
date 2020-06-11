import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { createRoute } from 'core/utils/routerUtils';

import LoanCardBody from './LoanCardBody';
import LoanCardHeader from './LoanCardHeader';

const handleCardClick = ({ history, linkDisabled, loanId }) => () => {
  if (!linkDisabled) {
    history.push(createRoute('/loans/:loanId', { loanId }));
  }
};

const LoanCard = ({ loan = {} }) => {
  const history = useHistory();
  const [linkDisabled, disableLink] = useState(false);
  const { _id: loanId } = loan;

  return (
    <div
      className="loan-card card1 card-hover"
      onClick={handleCardClick({ loanId, history, linkDisabled })}
    >
      <LoanCardHeader loan={loan} disableLink={disableLink} />
      <LoanCardBody loan={loan} history={history} />
    </div>
  );
};

export default LoanCard;
