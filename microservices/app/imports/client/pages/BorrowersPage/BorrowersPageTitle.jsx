//      
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import { SUCCESS } from 'core/api/constants';

                                  

const BorrowersPageTitle = ({ borrowers }                         ) => {
  const value = Calculator.personalInfoPercent({ borrowers });

  return (
    <span className="borrowers-page-title">
      <T id="BorrowersPage.title" />
      <small>
        &nbsp; - &nbsp;
        <PercentWithStatus
          value={value}
          status={value >= 1 && SUCCESS}
          rounded
        />
      </small>
    </span>
  );
};

export default BorrowersPageTitle;
