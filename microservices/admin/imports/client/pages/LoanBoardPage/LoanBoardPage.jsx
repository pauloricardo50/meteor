// @flow
import React from 'react';

import LoanBoard from './LoanBoard';

type LoanBoardPageProps = {};

const LoanBoardPage = ({ currentUser }: LoanBoardPageProps) => (
  <LoanBoard currentUser={currentUser} />
);

export default LoanBoardPage;
