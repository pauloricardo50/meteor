// @flow
import React from 'react';
import { withState, compose, withProps } from 'recompose';

import Calculator from 'core/utils/Calculator';
import BorrowersProgress from './BorrowersProgress/BorrowersProgress';
import BorrowersForm from './BorrowersForm/BorrowersForm';
import BorrowersCardHeader from './BorrowersCardHeader';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

type BorrowersCardProps = {};

const BorrowersCard = (props: BorrowersCardProps) => {
  const { loan, openBorrowersForm, setOpenBorrowersForm, progress } = props;

  return (
    <div className="borrowers-card">
      <BorrowersCardHeader {...props} />
      {openBorrowersForm ? (
        <div className="animated slideInDown">
          <BorrowersForm {...props} />
          <Button
            raised
            primary
            onClick={() => setOpenBorrowersForm(false)}
            style={{ width: '100%' }}
          >
            <T id="general.close" />
          </Button>
        </div>
      ) : (
        <div className="animated slideInUp">
          <BorrowersProgress {...props} />
          <Button
            raised
            secondary={progress < 1}
            primary={progress >= 1}
            onClick={() => setOpenBorrowersForm(true)}
            style={{ width: '100%' }}
          >
            <T
              id={
                progress < 1
                  ? progress === 0
                    ? 'general.start'
                    : 'general.continue'
                  : 'general.modify'
              }
            />
          </Button>
        </div>
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
