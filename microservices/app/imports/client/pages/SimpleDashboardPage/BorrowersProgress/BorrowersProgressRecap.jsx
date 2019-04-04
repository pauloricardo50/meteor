// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';

import { toMoney } from 'core/utils/conversionFunctions';
import Calculator from 'core/utils/Calculator';
import { RecapSimple } from 'core/components/Recap';
import T from 'core/components/Translation';

type BorrowersProgressRecapProps = {};

const getBorrowerArray = (borrower) => {
  const totalFunds = Calculator.getTotalFunds({ borrowers: borrower });
  const totalIncome = Calculator.getTotalIncome({ borrowers: borrower });

  return [
    {
      label: 'Recap.availableFunds',
      value: <b>{toMoney(totalFunds)}</b>,
    },
    {
      label: 'Recap.consideredIncome',
      value: <b>{toMoney(totalIncome)}</b>,
    },
  ];
};

const BorrowersProgressRecap = ({
  borrower,
  index,
}: BorrowersProgressRecapProps) => {
  const { name } = borrower;
  return (
    <div className="borrowers-progress-recap">
      <div className="header">
        <FontAwesomeIcon icon={faUserCircle} className="icon" />
        <h4>
          {name || (
            <T id="BorrowerHeader.title" values={{ index: index + 1 }} />
          )}
        </h4>
      </div>
      <div className="recap validator">
        <RecapSimple array={getBorrowerArray(borrower)} />
      </div>
    </div>
  );
};

export default BorrowersProgressRecap;
