// @flow
import React from 'react';
import cx from 'classnames';

import Calculator from 'core/utils/Calculator';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import BorrowerForm from './BorrowerForm';

type SimpleBorrowerPageFormsProps = {};

const SimpleBorrowerPageForms = ({ loan }: SimpleBorrowerPageFormsProps) => {
  const { borrowers, userFormsEnabled } = loan;
  const twoBorrowers = borrowers.length === 2;

  return (
    <div className={cx('forms', { 'two-borrowers': twoBorrowers })}>
      {borrowers.length === 1 && (
        <BorrowerForm
          borrowerId={borrowers[0]._id}
          userFormsEnabled={userFormsEnabled}
          loan={loan}
        />
      )}
      {twoBorrowers && (
        <Tabs
          tabs={borrowers.map((borrower, index) => {
            const progress = Calculator.personalInfoPercentSimple({
              borrowers: borrower,
              loan,
            });

            return {
              id: borrower._id,
              content: (
                <BorrowerForm
                  borrowerId={borrowers[index]._id}
                  userFormsEnabled={userFormsEnabled}
                  loan={loan}
                  key={borrowers[index]._id}
                />
              ),
              label: (
                <span className="borrower-tab-labels">
                  {borrower.name || (
                    <T
                      id="BorrowerHeader.title"
                      values={{ index: index + 1 }}
                    />
                  )}
                  &nbsp;&bull;&nbsp;
                  <PercentWithStatus
                    value={progress}
                    status={progress < 1 ? null : undefined}
                    rounded
                  />
                </span>
              ),
            };
          })}
        />
      )}
    </div>
  );
};

export default SimpleBorrowerPageForms;
