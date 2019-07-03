// @flow
import React from 'react';
import { withState, compose, withProps } from 'recompose';

import Calculator from 'core/utils/Calculator';
import BorrowersProgress from './BorrowersProgress/BorrowersProgress';
import BorrowersForm from './BorrowersForm/BorrowersForm';
import BorrowersCardHeader from './BorrowersCardHeader';

type BorrowersCardProps = {};

const BorrowersCard = (props: BorrowersCardProps) => {
  const { loan, openBorrowersForm } = props;

  return (
    <div className="borrowers-card">
      <BorrowersCardHeader {...props} />
      {openBorrowersForm ? (
        <BorrowersForm {...props} />
      ) : (
        <BorrowersProgress {...props} />
      )}
    </div>
  );
};

export default compose(
  withState('simpleForm', 'setSimpleForm', true),
  withProps(({ loan }) => ({
    progress: Calculator.personalInfoPercentSimple({ loan }),
  })),
)(BorrowersCard);
