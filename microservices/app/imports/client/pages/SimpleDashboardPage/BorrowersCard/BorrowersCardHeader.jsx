// @flow
import React from 'react';

import Calculator from 'core/utils/Calculator';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Button from 'core/components/Button';
import SimpleFormSwitch from './SimpleFormSwitch';

type BorrowersCardHeaderProps = {};

const BorrowersCardHeader = (props: BorrowersCardHeaderProps) => {
  const { loan, openBorrowersForm, setOpenBorrowersForm, progress } = props;
  const {
    borrowers = [],
    simpleBorrowersForm: simpleForm = true,
    _id: loanId,
  } = loan;

  return (
    <div className="borrowers-card-header">
      <div style={{ width: '100%' }}>
        <div className="flex-row title">
          <h3 className="flex-row">
            Emprunteurs&nbsp;-&nbsp;
            <PercentWithStatus
              value={progress}
              status={progress < 1 ? null : undefined}
              rounded
            />
          </h3>
          {openBorrowersForm &&
            (!!borrowers.length && (
              <SimpleFormSwitch simpleForm={simpleForm} loanId={loanId} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowersCardHeader;
