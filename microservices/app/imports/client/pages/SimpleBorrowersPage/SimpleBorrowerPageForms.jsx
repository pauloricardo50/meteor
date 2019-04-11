// @flow
import React from 'react';

import Calculator from 'core/utils/Calculator';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import BorrowerForm from './BorrowerForm';

type SimpleBorrowerPageFormsProps = {};

const SimpleBorrowerPageForms = ({ loan }: SimpleBorrowerPageFormsProps) => {
  const { borrowers, userFormsEnabled, _id: loanId } = loan;

  return (
    <div className="forms">
      {borrowers.length === 1 && (
        <BorrowerForm
          borrowers={borrowers}
          borrowerId={borrowers[0]._id}
          userFormsEnabled={userFormsEnabled}
          loanId={loanId}
        />
      )}
      {borrowers.length === 2 && (
        <Tabs
          tabs={borrowers.map((borrower, index) => {
            const progress = Calculator.personalInfoPercentSimple({
              borrowers: borrower,
            });

            return {
              id: borrower._id,
              content: (
                <BorrowerForm
                  borrowers={borrowers}
                  borrowerId={borrowers[index]._id}
                  userFormsEnabled={userFormsEnabled}
                  key={borrowers[index]._id}
                  loanId={loanId}
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
