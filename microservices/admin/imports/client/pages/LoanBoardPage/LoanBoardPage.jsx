// @flow
import React from 'react';

import LoanBoard from './LoanBoard';

type LoanBoardPageProps = {};

const LoanBoardPage = ({ currentUser, loanBoardOptions, loanBoardDispatch }: LoanBoardPageProps) => (
    <LoanBoard currentUser={currentUser} options={loanBoardOptions} dispatch={loanBoardDispatch} />
);

export default LoanBoardPage;
