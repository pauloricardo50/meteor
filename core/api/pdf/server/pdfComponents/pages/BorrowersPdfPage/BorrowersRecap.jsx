import React from 'react';

import BorrowersRecapFinance from './BorrowersRecapFinance';
import BorrowersRecapInfo from './BorrowersRecapInfo';

const BorrowersRecap = props => (
  <div className="borrowers-recap">
    <BorrowersRecapInfo {...props} />
    <BorrowersRecapFinance {...props} />
  </div>
);

export default BorrowersRecap;
