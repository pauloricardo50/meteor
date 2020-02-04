//      
import React from 'react';

import BorrowersRecapInfo from './BorrowersRecapInfo';
import BorrowersRecapFinance from './BorrowersRecapFinance';

                            
                           
  

const BorrowersRecap = (props                     ) => (
  <div className="borrowers-recap">
    <BorrowersRecapInfo {...props} />
    <BorrowersRecapFinance {...props} />
  </div>
);

export default BorrowersRecap;
