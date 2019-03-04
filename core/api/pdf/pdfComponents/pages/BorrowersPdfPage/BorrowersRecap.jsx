// @flow
import React from 'react';

import BorrowersRecapInfo from './BorrowersRecapInfo';
import BorrowersRecapFinance from './BorrowersRecapFinance';

type BorrowersRecapProps = {
  borrowers: Array<Object>,
};

const BorrowersRecap = (props: BorrowersRecapProps) => (
  <div className="borrowers-recap">
    <BorrowersRecapInfo {...props} />
    <BorrowersRecapFinance {...props} />
  </div>
);

export default BorrowersRecap;
