// @flow
import React from 'react';

import LoanBoard from './LoanBoard';

type LoanBoardPageProps = {};

const LoanBoardPage = ({ currentUser, loanBoardOptions }: LoanBoardPageProps) => (
  <>
    {console.log("-------------------------------------", loanBoardOptions)}
    <LoanBoard currentUser={currentUser} options={loanBoardOptions} />
  </>
);

export default LoanBoardPage;
