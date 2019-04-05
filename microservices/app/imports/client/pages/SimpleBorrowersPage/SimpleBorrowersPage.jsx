// @flow
import React from 'react';

import Calculator from 'core/utils/Calculator';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import BorrowerForm from './BorrowerForm';

type SimpleBorrowersPageProps = {};

const SimpleBorrowersPage = ({ loan }: SimpleBorrowersPageProps) => {
  const { borrowers, userFormsEnabled } = loan;

  return (
    <div className="simple-borrowers-page animated fadeIn">
      <div className="card1 card-top">
        <h2>Complétez vos informations</h2>

        {borrowers.length === 1 && (
          <BorrowerForm
            borrowers={borrowers}
            borrowerId={borrowers[0]._id}
            userFormsEnabled={userFormsEnabled}
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
    </div>
  );
};

export default SimpleBorrowersPage;
