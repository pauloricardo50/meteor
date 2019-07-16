// @flow
import React from 'react';

import T from 'core/components/Translation';
import BorrowersProgressRecap from './BorrowersProgressRecap';

type BorrowersProgressProps = {};

const BorrowersProgress = ({
  loan,
  progress,
  setOpenBorrowersForm,
}: BorrowersProgressProps) => {
  const { borrowers } = loan;

  return (
    <div className="borrowers-progress">
      {progress === 0 ? (
        <h4 className="secondary borrowers-progress-empty">
          <T id="BorrowersProgress.empty" />
        </h4>
      ) : (
        <div className="borrowers-progress-borrowers">
          {borrowers.map((borrower, index) => [
            index !== 0 && <hr />,
            <BorrowersProgressRecap
              key={borrower._id}
              borrower={borrower}
              index={index}
            />,
          ])}
        </div>
      )}
    </div>
  );
};

export default BorrowersProgress;
