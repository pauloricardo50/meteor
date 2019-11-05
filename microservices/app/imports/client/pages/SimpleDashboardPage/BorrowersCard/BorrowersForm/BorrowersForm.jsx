// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import BorrowersAdder from '../../../../components/BorrowersAdder';
import BorrowersFormContainer from './BorrowersFormContainer';
import SimpleFormSwitch from '../SimpleFormSwitch';

type BorrowersFormProps = {};

const BorrowersForm = (props: BorrowersFormProps) => {
  const { loan, tabs, openBorrowersForm } = props;
  const { borrowers = [], _id: loanId, simpleBorrowersForm } = loan;

  return (
    <div className="borrowers-form">
      {!!borrowers.length && (
        <SimpleFormSwitch simpleForm={simpleBorrowersForm} loanId={loanId} />
      )}

      {!borrowers.length ? (
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
