// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import SimpleBorrowerPageForms from './SimpleBorrowerPageForms';
import SimpleBorrowersPageMaxPropertyValue from './SimpleBorrowersPageMaxPropertyValue';

type SimpleBorrowersPageProps = {};

const SimpleBorrowersPage = ({ loan }: SimpleBorrowersPageProps) => {
  const progress = Calculator.personalInfoPercentSimple({ loan });

  return (
    <div className="simple-borrowers-page animated fadeIn">
      <div className="card1 card-top simple-borrowers-page-forms">
        <h2>Complétez vos informations</h2>
        <h4 className="secondary">
          <T
            id="BorrowersProgress.progress"
            values={{
              percent: (
                <>
                  &nbsp;
                  <PercentWithStatus
                    value={progress}
                    status={progress < 1 ? null : undefined}
                    rounded
                  />
                </>
              ),
            }}
          />
        </h4>

        <SimpleBorrowerPageForms loan={loan} />
      </div>
      <SimpleBorrowersPageMaxPropertyValue />
    </div>
  );
};

export default SimpleBorrowersPage;
