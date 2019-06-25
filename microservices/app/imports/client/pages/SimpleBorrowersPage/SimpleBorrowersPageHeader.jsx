// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import SimpleFormSwitch from './SimpleFormSwitch';

type SimpleBorrowersPageHeaderProps = {};

const SimpleBorrowersPageHeader = ({
  loan,
  simpleForm,
  setSimpleForm,
}: SimpleBorrowersPageHeaderProps) => {
  const progress = Calculator.personalInfoPercentSimple({
    loan,
    simple: simpleForm,
  });

  const { borrowers = [] } = loan;

  return (
    <div className="simple-borrowers-page-header">
      <div style={{ width: '100%' }}>
        <div className="flex-row title">
          <h2>Emprunteurs</h2>
          {!!borrowers.length && (
            <SimpleFormSwitch
              simpleForm={simpleForm}
              setSimpleForm={setSimpleForm}
            />
          )}
        </div>
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
      </div>
    </div>
  );
};

export default SimpleBorrowersPageHeader;
