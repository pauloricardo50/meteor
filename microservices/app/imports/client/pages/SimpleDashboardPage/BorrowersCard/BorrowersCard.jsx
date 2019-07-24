// @flow
import React from 'react';
import { withProps } from 'recompose';

import Calculator from 'core/utils/Calculator';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import BorrowersProgress from './BorrowersProgress/BorrowersProgress';
import BorrowersForm from './BorrowersForm/BorrowersForm';
import BorrowersCardHeader from './BorrowersCardHeader';

type BorrowersCardProps = {};

const BorrowersCard = (props: BorrowersCardProps) => {
  const { loan, openBorrowersForm, setOpenBorrowersForm, progress } = props;
  const { borrowers = [] } = loan;

  return (
    <div className="borrowers-card">
      <div>
        <BorrowersCardHeader {...props} />
        {openBorrowersForm ? (
          <div className="flex-col animated fadeIn">
            <BorrowersForm {...props} />
            {!!borrowers.length && (
              <Button
                raised
                primary
                onClick={() => setOpenBorrowersForm(false)}
              >
                <T id="general.close" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex-col animated fadeIn">
            <BorrowersProgress {...props} />
            <Button
              raised
              secondary={progress < 1}
              primary={progress >= 1}
              onClick={() => setOpenBorrowersForm(true)}
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
    </div>
  );
};

export default withProps(({ loan }) => ({
  progress: Calculator.personalInfoPercentSimple({ loan }),
}))(BorrowersCard);
