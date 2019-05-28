// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withState, compose } from 'recompose';

import { createRoute } from 'core/utils/routerUtils';
import LoanCardHeader from './LoanCardHeader';
import LoanCardBody from './LoanCardBody';

type LoanCardProps = {
  loan: Object,
  disableLink: Function,
  linkDisabled: Boolean,
  history: OBject,
};

const handleCardClick = ({ history, linkDisabled, loanId }) => () => {
  if (!linkDisabled) {
    history.push(createRoute('/loans/:loanId', { loanId }));
  }
};

const LoanCard = ({
  loan = {},
  disableLink,
  linkDisabled,
  history,
}: LoanCardProps) => {
  const { _id: loanId } = loan;

  return (
    <div
      className="loan-card"
      onClick={handleCardClick({ loanId, history, linkDisabled })}
    >
      <LoanCardHeader loan={loan} disableLink={disableLink} />
      <LoanCardBody loan={loan} history={history} />
    </div>
  );
};

export default compose(
  withRouter,
  withState('linkDisabled', 'disableLink', false),
)(LoanCard);
