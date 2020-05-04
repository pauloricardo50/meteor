import React from 'react';

import Tabs from 'core/components/Tabs';

import BorrowersAdder from '../../../../components/BorrowersAdder/BorrowersAdder';
import SimpleFormSwitch from '../SimpleFormSwitch';
import BorrowersFormContainer from './BorrowersFormContainer';

const BorrowersForm = props => {
  const { loan, tabs, openBorrowersForm } = props;
  const { borrowers = [], _id: loanId, simpleBorrowersForm } = loan;

  const hasBorrowers = !!borrowers.length;

  return (
    <div className="borrowers-form">
      {hasBorrowers && (
        <SimpleFormSwitch simpleForm={simpleBorrowersForm} loanId={loanId} />
      )}

      {!hasBorrowers ? (
        <BorrowersAdder loanId={loanId} />
      ) : (
        <Tabs
          tabs={tabs}
          initialIndex={openBorrowersForm >= 0 ? openBorrowersForm : undefined}
        />
      )}
    </div>
  );
};

export default BorrowersFormContainer(BorrowersForm);
