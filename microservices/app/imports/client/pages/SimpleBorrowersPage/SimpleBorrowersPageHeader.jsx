// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import BorrowerAdder from '../../components/BorrowerAdder';

type SimpleBorrowersPageHeaderProps = {};

const SimpleBorrowersPageHeader = ({
  loan,
}: SimpleBorrowersPageHeaderProps) => {
  const { borrowers, _id: loanId } = loan;
  const progress = Calculator.personalInfoPercentSimple({ loan });

  return (
    <div className="simple-borrowers-page-header">
      <div>
        <h2>Complétez vos informations</h2>
        <h4 className="secondary">
          <T
            id="BorrowersProgress.progress"
            values={{
              percent: (
                <>
                  &nbsp;
                  <PercentWithStatus
                    value={progress}
                    status={progress < 1 ? null : undefined}
                    rounded
                  />
                </>
              ),
            }}
          />
        </h4>
      </div>
      <div>{borrowers.length === 1 && <BorrowerAdder loanId={loanId} />}</div>
    </div>
  );
};

export default SimpleBorrowersPageHeader;
