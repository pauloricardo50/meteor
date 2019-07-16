// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import BorrowersAdder from '../../../../components/BorrowersAdder';
import BorrowersFormContainer from './BorrowersFormContainer';

type BorrowersFormProps = {};

const BorrowersForm = (props: BorrowersFormProps) => {
  const { loan, simpleForm, tabs } = props;
  const { borrowers = [], _id: loanId } = loan;
  return (
    <div className="borrowers-form">
      {!borrowers.length ? (
        <BorrowersAdder loanId={loanId} />
      ) : (
        <Tabs tabs={tabs} />
      )}
    </div>
  );
};

export default BorrowersFormContainer(BorrowersForm);
